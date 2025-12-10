// Sample data for testing AutocompleteInput component
// Includes diverse data to test filtering edge cases, special characters, and various lengths

export const sampleCategories = [
    // Standard categories
    'Travel',
    'Food & Cuisine',
    'Architecture',
    'Nature & Landscapes',
    'People & Portraits',
    'Events & Celebrations',
    'Art & Culture',
    'Sports & Activities',
    'Urban Life',
    'Historical Sites',
    
    // Categories with special characters
    'Café & Restaurants',
    'Père-Lachaise Cemetery',
    'São Paulo Street Art',
    'Niño Birthday Party',
    'München Oktoberfest',
    'Zürich Old Town',
    'Montréal Winter Festival',
    'Señor García Wedding',
    'Naïve Art Collection',
    'Résidence Royale',
    
    // Categories with numbers and mixed case
    '2023 Summer Collection',
    'COVID-19 Documentation',
    'iPhone 14 Photography',
    'Route 66 Journey',
    'Formula 1 Racing',
    'World War II Memorial',
    '21st Century Architecture',
    'Gen Z Lifestyle',
    'Y2K Nostalgia',
    'Web 3.0 Conference',
    
    // Very short and very long categories
    'Art',
    'Fun',
    'NYC',
    'LA',
    'Comprehensive Documentation of Traditional Japanese Tea Ceremony Practices in Modern Urban Settings',
    'An Extensive Collection of Rare Botanical Specimens Found in Remote Mountainous Regions of South America',
    'Professional Wedding Photography Portfolio Showcasing Diverse Cultural Celebrations Across Multiple Continents'
];

export const sampleSubcategories = [
    // Travel subcategories
    'Beach Destinations',
    'Mountain Adventures',
    'City Breaks',
    'Cultural Tours',
    'Road Trips',
    'Backpacking',
    'Luxury Travel',
    'Budget Travel',
    'Solo Adventures',
    'Family Vacations',
    
    // Food subcategories with special characters
    'Street Food',
    'Fine Dining',
    'Home Cooking',
    'Café Culture',
    'Wine & Spirits',
    'Desserts & Sweets',
    'Végétarien Cuisine',
    'Spicy & Hot',
    'Comfort Food',
    'Fusion Cuisine',
    
    // Architecture subcategories
    'Modern Buildings',
    'Historic Structures',
    'Religious Architecture',
    'Residential Design',
    'Industrial Spaces',
    'Bridges & Infrastructure',
    'Art Deco Style',
    'Gothic Revival',
    'Bauhaus Movement',
    'Sustainable Design',
    
    // Nature subcategories with various lengths
    'Forests',
    'Oceans',
    'Deserts',
    'Mountains',
    'Rivers & Lakes',
    'Wildlife Photography',
    'Macro Nature Details',
    'Seasonal Changes Documentation',
    'Endangered Species Conservation Efforts',
    'Climate Change Impact Studies on Local Ecosystems',
    
    // Special characters and unicode
    'Niños Playing',
    'Señoras Cooking',
    'Père & Fils',
    'Mère Nature',
    'Frère Jacques',
    'Sœur Marie',
    'Naïve Expressions',
    'Café Conversations',
    'Résidence Views',
    'Château Gardens',
    
    // Mixed case and numbers
    'iPhone Photography',
    'DSLR Techniques',
    'Film vs Digital',
    '35mm Nostalgia',
    '4K Video Clips',
    '8K Resolution',
    'HDR Processing',
    'RAW Editing',
    'JPEG Compression',
    'PNG Transparency'
];

export const sampleCollections = [
    // Standard collections
    'Summer 2023',
    'Winter Wonderland',
    'Spring Blossoms',
    'Autumn Colors',
    'Holiday Memories',
    'Weekend Getaway',
    'Daily Life',
    'Special Occasions',
    'Work Portfolio',
    'Personal Projects',
    
    // Collections with special characters
    'Día de los Muertos',
    'Año Nuevo Celebration',
    'Père Noël Visit',
    'Mère Garden',
    'Café Morning Routine',
    'Niño First Steps',
    'Señora María Recipes',
    'München Beer Festival',
    'Zürich Christmas Market',
    'Montréal Jazz Festival',
    
    // Collections with numbers and dates
    'Collection #1',
    'Set 2023-A',
    'Batch 001',
    'Series IV',
    'Volume XII',
    'Edition 2.0',
    'Version 3.1.4',
    'Build 2023.12.08',
    'Release Candidate 1',
    'Beta Testing Phase',
    
    // Very short collections
    'A',
    'B1',
    'X',
    'Z9',
    'Q',
    
    // Very long collections
    'Comprehensive Wedding Photography Collection Including Ceremony Preparation Reception and After Party',
    'Complete Documentation of Traditional Cooking Methods Passed Down Through Five Generations',
    'Extensive Travel Photography Portfolio Covering Thirty Countries Across Six Continents Over Two Years',
    
    // Collections with punctuation
    'Before & After',
    'Then vs. Now',
    'Here & There',
    'Up & Down',
    'In & Out',
    'Black & White',
    'Day & Night',
    'Old & New',
    'Fast & Slow',
    'Big & Small',
    
    // Collections with emojis and unicode (testing edge cases)
    'Happy Faces 😊',
    'Travel Adventures ✈️',
    'Food Lovers 🍕',
    'Nature Walks 🌲',
    'City Life 🏙️'
];

export const sampleNames = [
    // Standard photo names
    'sunset-beach.jpg',
    'mountain-view.jpg',
    'city-skyline.jpg',
    'family-portrait.jpg',
    'wedding-ceremony.jpg',
    'birthday-party.jpg',
    'vacation-memories.jpg',
    'nature-walk.jpg',
    'food-photography.jpg',
    'architecture-study.jpg',
    
    // Names with special characters
    'café-morning.jpg',
    'père-et-fils.jpg',
    'niño-playing.jpg',
    'señora-cooking.jpg',
    'münchen-street.jpg',
    'zürich-lake.jpg',
    'montréal-winter.jpg',
    'naïve-art.jpg',
    'résidence-view.jpg',
    'château-garden.jpg',
    
    // Names with numbers and dates
    'IMG_001.jpg',
    'DSC_2023_001.jpg',
    'photo-2023-12-08.jpg',
    'snapshot-001.jpg',
    'image-v2.jpg',
    'pic-final.jpg',
    'shot-001-edited.jpg',
    'frame-123.jpg',
    'capture-2023.jpg',
    'moment-001.jpg',
    
    // Names with different file extensions
    'portrait.png',
    'landscape.gif',
    'macro.tiff',
    'street.bmp',
    'abstract.webp',
    'documentary.raw',
    'artistic.svg',
    'vintage.heic',
    'modern.avif',
    'classic.jpeg',
    
    // Very short names
    'a.jpg',
    'b.png',
    'x.gif',
    'z.jpg',
    '1.jpg',
    '2.png',
    '9.gif',
    
    // Very long names
    'extremely-long-filename-that-describes-a-very-specific-moment-captured-during-a-beautiful-sunset-at-the-beach-with-family-and-friends-enjoying-their-summer-vacation-together.jpg',
    'comprehensive-documentation-of-traditional-cooking-methods-used-by-grandmother-in-her-kitchen-during-sunday-family-gatherings.jpg',
    'professional-wedding-photography-session-including-preparation-ceremony-reception-and-dancing-celebration.jpg',
    
    // Names with underscores and hyphens
    'beach_sunset_2023.jpg',
    'mountain-hike-adventure.jpg',
    'city_street_photography.jpg',
    'family-reunion-2023.jpg',
    'food_photography_session.jpg',
    'architecture_study_modern.jpg',
    'nature_macro_details.jpg',
    'portrait_session_outdoor.jpg',
    'travel_memories_europe.jpg',
    'wedding_ceremony_church.jpg',
    
    // Names with mixed case
    'BeachSunset.jpg',
    'MountainView.JPG',
    'CityLife.PNG',
    'FamilyTime.gif',
    'NatureWalk.JPEG',
    'FoodLover.jpg',
    'ArtisticShot.png',
    'VintageStyle.jpg',
    'ModernArt.PNG',
    'ClassicPortrait.JPG',
    
    // Names with spaces (edge case)
    'beach sunset.jpg',
    'mountain view.jpg',
    'city life.jpg',
    'family time.jpg',
    'nature walk.jpg',
    'food lover.jpg',
    'artistic shot.jpg',
    'vintage style.jpg',
    'modern art.jpg',
    'classic portrait.jpg',
    
    // Names with special punctuation
    'before&after.jpg',
    'then-vs-now.jpg',
    'here&there.jpg',
    'up&down.jpg',
    'in&out.jpg',
    'black&white.jpg',
    'day&night.jpg',
    'old&new.jpg',
    'fast&slow.jpg',
    'big&small.jpg'
];

// Helper function to get sample data by field type
export const getSampleDataByField = (fieldType) => {
    switch (fieldType.toLowerCase()) {
        case 'category':
            return sampleCategories;
        case 'subcategory':
            return sampleSubcategories;
        case 'collection':
            return sampleCollections;
        case 'name':
            return sampleNames;
        default:
            return [];
    }
};

// Helper function to get random sample data for testing
export const getRandomSampleData = (fieldType, count = 10) => {
    const data = getSampleDataByField(fieldType);
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, data.length));
};

// Export all sample data as a combined object for easy access
export const allSampleData = {
    categories: sampleCategories,
    subcategories: sampleSubcategories,
    collections: sampleCollections,
    names: sampleNames
};

export default {
    sampleCategories,
    sampleSubcategories,
    sampleCollections,
    sampleNames,
    getSampleDataByField,
    getRandomSampleData,
    allSampleData
};