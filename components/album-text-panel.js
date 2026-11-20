import React, {useEffect, useRef, useState} from 'react';
import {adminGet, adminPost, getErrorStatus, isForbidden} from "../common/admin-api";
import {NO_ACCESS_MESSAGE} from "../common/permissions";
import {onError} from "../common/error";
import LoaderButton from "./loader-button";
import TextArea from "./textarea";

// The editor notes limit matches the API (startAlbumText in gallery/handler.js).
const NOTES_MAX = 1000;
const POLL_MS = 4000;
// The API reports a run that takes more than 5 minutes as failed; stop polling a little after that.
const POLL_LIMIT_MS = 6 * 60 * 1000;
const boxStyle = {border: '1px solid #ccc', borderRadius: 4, padding: '0.75rem', margin: '0.5rem 0', fontSize: '0.9rem', color: 'rgb(255, 255, 255)'};
const warningStyle = {...boxStyle, borderColor: 'rgb(255, 0, 0)', color: 'rgb(255, 0, 0)'};

// Public title photo path: the 300 x 200 file the album page shows. Same rule as the API (getPublicPrefix + toSlug(name)).
const slug = (value) => String(value || '').replace(/&/g, 'and').replace(/ /g, '-').toLowerCase();
export const publicTitlePhotoPath = ({category, subCategory, collection, name}) =>
    'public/images/gallery/' + [category, subCategory, collection, name].map(slug).join('/') + '.jpg';

/**
 * Generate text / Regenerate for one saved album. Generation only returns a draft: nothing is saved until the
 * editor clicks Save Gallery in the form.
 *
 * Props:
 *  album            { category, subCategory, collection, name, startDateTime } of the saved album (startDateTime as stored)
 *  photoCount       the photo count currently in the form (string)
 *  onApplyDraft     (draft) => void  puts the draft text into the form
 *  onRestore        () => void       puts the text from before the last draft back
 *  canRestore       boolean
 *  onUsePhotoCount  (count) => void
 */
function AlbumTextPanel({album, photoCount, onApplyDraft, onRestore, canRestore, onUsePhotoCount}) {
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('idle'); // idle | running | ready | failed
    const [message, setMessage] = useState('');
    const [draft, setDraft] = useState(null);
    const [selectedCover, setSelectedCover] = useState('');
    const timer = useRef(null);
    // The polling timer outlives renders, so it calls the latest handler through a ref.
    const applyRef = useRef(onApplyDraft);
    useEffect(() => {
        applyRef.current = onApplyDraft;
    });

    const stopPolling = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    };
    useEffect(() => stopPolling, []);

    // Reads the draft until the one that was just started is ready or failed. Defined inside the click handler so the
    // timer chain keeps its own draft id and album key.
    const generate = async () => {
        stopPolling();
        setStatus('running');
        setMessage('');
        setDraft(null);
        const path = '/albumText/' + encodeURIComponent(album.name) + '/' + encodeURIComponent(album.startDateTime);
        try {
            const res = await adminPost('startAlbumText', '/albumText', {
                name: album.name,
                startDateTime: album.startDateTime,
                notes: notes.trim() || undefined
            });
            const started = await res.body.json();
            const startedAt = Date.now();
            const tick = async () => {
                try {
                    const response = await adminGet('findAlbumTextDraft', path);
                    const found = await response.body.json();
                    // An older draft of the same album can still be stored; wait for the one that was just started.
                    if (found.draftId === started.draftId && found.status === 'ready') {
                        setDraft(found);
                        setSelectedCover(found.suggestedCover || '');
                        setStatus('ready');
                        setMessage('');
                        applyRef.current(found);
                        return;
                    }
                    if (found.draftId === started.draftId && found.status === 'failed') {
                        setStatus('failed');
                        setMessage(found.message || 'The draft could not be generated.');
                        return;
                    }
                } catch (error) {
                    if (isForbidden(error)) {
                        setStatus('failed');
                        setMessage(NO_ACCESS_MESSAGE);
                        return;
                    }
                    // A 404 just after the start is not an error; keep trying until the time limit.
                    if (getErrorStatus(error) !== 404) onError(error);
                }
                if (Date.now() - startedAt > POLL_LIMIT_MS) {
                    setStatus('failed');
                    setMessage('The draft took too long. Try again.');
                    return;
                }
                timer.current = setTimeout(tick, POLL_MS);
            };
            timer.current = setTimeout(tick, POLL_MS);
        } catch (error) {
            setStatus('failed');
            const code = getErrorStatus(error);
            if (isForbidden(error)) setMessage(NO_ACCESS_MESSAGE);
            else if (code === 409) setMessage('A draft is already being generated for this album. Wait for it to finish.');
            else if (code === 429) setMessage('You have reached the daily limit for drafts. Try again tomorrow.');
            else setMessage('The draft could not be started. Try again.');
            if (error !== 'No current user') onError(error);
        }
    };

    const running = status === 'running';
    const counts = draft && draft.photoCount !== undefined ? draft : null;
    return (
        <div className="galleryfieldcontainer" style={boxStyle}>
            <label style={{fontWeight: 'bold'}}>Generate the album text</label>
            <p>
                Sync the photos to the album folder first. Aim for 150 to 300 words on what and where, the month and
                year, and two or three highlights. Do not add family member names, exact addresses, hotel or booking
                details or private dates. The draft is loaded into the form below and is saved only when you click
                Save Gallery.
            </p>
            <TextArea id="albumTextNotes"
                      name="albumTextNotes"
                      label="Editor notes (optional)"
                      disabled={running}
                      required={false}
                      rows={4}
                      maxLength={NOTES_MAX}
                      note={'Facts the text may use: places, events, an itinerary. ' + notes.length + ' of ' + NOTES_MAX + ' characters'}
                      initialValue={notes}
                      value={notes}
                      placeHolder="e.g. A week in Dorset with a day trip to Lulworth Cove."
                      onChange={(event) => setNotes(event.target.value)} />
            <div className="gallerybuttoncontainer">
                <LoaderButton name="GenerateAlbumTextButton"
                              type="button"
                              label={status === 'idle' ? 'Generate text' : 'Regenerate'}
                              disabled={running}
                              isLoading={running}
                              onClick={generate} />
            </div>
            {running && <p role="status">Reading the photos. This takes up to two minutes.</p>}
            {status === 'failed' && <p role="alert" style={{color: 'rgb(255, 0, 0)', fontWeight: 'bold'}}>{message}</p>}
            {canRestore && (
                <p>
                    The draft replaced the text in the form.{' '}
                    <a className="gallerylink" role="button" tabIndex={0} onClick={onRestore}
                       onKeyDown={(event) => { if (event.key === 'Enter') onRestore(); }}>Restore the previous text</a>
                </p>
            )}
            {status === 'ready' && draft && (
                <>
                    {draft.warnings && draft.warnings.length > 0 && (
                        <div role="alert" style={warningStyle}>
                            <strong>Private details were removed. Check the text before you save.</strong>
                            <ul>
                                {draft.warnings.map((warning, index) => (
                                    <li key={index}>{warning.field}: {warning.type}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {draft.factsToCheck && draft.factsToCheck.length > 0 && (
                        <div style={boxStyle}>
                            <strong>Check these facts</strong>
                            <ul>
                                {draft.factsToCheck.map((fact, index) => <li key={index}>{fact}</li>)}
                            </ul>
                        </div>
                    )}
                    {counts && (
                        <div style={boxStyle}>
                            <strong>Found in the album folder:</strong> {counts.photoCount} photos and {counts.videoCount} videos.
                            {' '}The form has {photoCount} photos.
                            {String(counts.photoCount) !== String(photoCount) && counts.photoCount <= 99 && (
                                <>{' '}<a className="gallerylink" role="button" tabIndex={0}
                                          onClick={() => onUsePhotoCount(counts.photoCount)}
                                          onKeyDown={(event) => { if (event.key === 'Enter') onUsePhotoCount(counts.photoCount); }}>
                                    Use {counts.photoCount}
                                </a></>
                            )}
                            <br />The video count is set from the video folder when you save.
                        </div>
                    )}
                    {draft.candidates && draft.candidates.length > 0 && (
                        <div style={boxStyle}>
                            <strong>Cover photo</strong>
                            <p>
                                Suggested: {draft.suggestedCover}. The title photo is public and needs no sign-in,
                                so prefer a landscape or landmark photo with no close-up of a person.
                            </p>
                            {draft.candidates.map((name) => (
                                <label key={name} style={{display: 'block'}}>
                                    <input type="radio" name="albumTextCover" value={name}
                                           checked={selectedCover === name}
                                           onChange={() => setSelectedCover(name)} />
                                    {' '}{name}{name === draft.suggestedCover ? ' (suggested)' : ''}
                                </label>
                            ))}
                            {selectedCover && (
                                <p>
                                    To use it, save a 300 x 200 copy of <strong>{selectedCover}</strong> as{' '}
                                    <code>{publicTitlePhotoPath(album)}</code>. This is still a manual step.
                                </p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AlbumTextPanel;
