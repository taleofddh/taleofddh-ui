import React, {useState, useEffect, useMemo} from 'react';
import Dropzone, {useDropzone} from 'react-dropzone';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: 'rgb(107, 110, 112)',
    borderStyle: 'dashed',
    backgroundColor: 'rgb(251, 251, 251)',
    color: 'rgb(107, 110, 112)',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    cursor: 'pointer',
    margin: '5px 0px 10px'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

function FileUpload({label, accept, maxFiles, required, className, value, onChange}) {
    const [files, setFiles] = useState([]);
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: accept,
        maxFiles: maxFiles,
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            onChange && onChange(acceptedFiles);
        }
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                />
            </div>
        </div>
    ));

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    let reqdText;
    if(required) {
        reqdText = '*';
    } else {
        reqdText = '';
    }

    return (
        <div className={`fileupload ${className}`}>
            <label className="fileuploadlabel">
                {label}
                <span className="required">{reqdText}</span>
            </label>
            <section>
                <p {...getRootProps({style})}>
                    <input {...getInputProps()} />
                    <span>Drag &apos;n&apos; drop files here, or click to select files</span>
                    <em>(Only pdf files will be accepted)</em>
                    <em>(You can upload maximum of {maxFiles} files)</em>
                </p>
                {/*<aside style={thumbsContainer}>
                    {thumbs}
                </aside>*/}
                <aside>
                    <h4>Files to be analysed</h4>
                    <ul className="propertydocumentfilelist">{acceptedFileItems}</ul>
                    <h4>Rejected files</h4>
                    <ul className="propertydocumentfilelist">{fileRejectionItems}</ul>
                </aside>
            </section>
        </div>
    )
}

export default FileUpload;