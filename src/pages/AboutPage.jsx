import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './AboutPage.css';
import '../styles/global.css';

// Accordion Item Component for Contributors
const ContributorAccordionItem = ({ contributor, isOpen, toggleAccordion }) => {
    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <div 
                className="accordion-header" 
                onClick={toggleAccordion}
            >
                <h3>{contributor.name}</h3>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
                <div className="accordion-content">
                    <p className="contributor-bio">{contributor.bio}</p>
                </div>
            )}
        </div>
    );
};

const AboutPage = () => {
    const { theme } = useTheme();
    const [openContributorId, setOpenContributorId] = useState(null);

    const toggleContributorAccordion = (contributorId) => {
        setOpenContributorId(openContributorId === contributorId ? null : contributorId);
    };
    
    // Contributors data with full bios
    const allContributors = [
        // Volume I Contributors
        {
            id: 1,
            volume: 'I',
            name: "Claire Landsbaum",
            bio: "Claire Landsbaum (she/they) is a Brooklyn-based journalist whose work has appeared in Vanity Fair, New York Magazine, and Slate. She is currently Highsnobiety's Deputy Editor. In her spare time, she writes creepy stories about queerness and New York City."
        },
        {
            id: 2,
            volume: 'I',
            name: "Julian Shendelman",
            bio: "Julian Shendelman is a writer, editor, and community organizer based in Lansdowne, PA, just outside of West Philadelphia. I've been published in Philadelphia Stories and Cleaver Magazine, and my collaborative novella Spark Bird was published by Thirty West in 2024. I am one of 2 co-directors of Blue Stoop, a literary arts nonprofit serving adults in the greater Philadelphia area."
        },
        {
            id: 3,
            volume: 'I',
            name: "Sarah Chin",
            bio: "Sarah Chin is a writer with a day job in politics. Her work has previously been published in HAD, Anodyne, The Belladonna, Kingfisher Magazine, and more. She lives in Chicago, Illinois and can be found at https://sarahchinwrites.wordpress.com/."
        },
        {
            id: 4,
            volume: 'I',
            name: "Jess Mendes",
            bio: "Jess Mendes is a writer based in Upstate New York. Her work spans poetry, fiction, and literary commentary, often orbiting themes of memory, the strange, and the earnest. You can find her on IG @messjendes—or in the physical realm, likely at an antique mall or public campground."
        },
        {
            id: 5,
            volume: 'I',
            name: "Colin Griffin",
            bio: "Colin Griffin is a musician, writer, and artist from Buffalo, New York. He was recently published in Cool Beans Lit, Anti-Heroin Chic, and #Ranger Magazine."
        },
        {
            id: 6,
            volume: 'I',
            name: "Patrick Nathan",
            bio: "Patrick Nathan is the author of Image Control: Social Media, Fascism, and the Dismantling of Democracy (2021) and Some Hell (2018), a finalist for the Lambda Literary Award. His new novel, The Future Was Color, appeared in June 2024, and was the Los Angeles Review of Books summer book club pick of that year. He also writes Entertainment, Weakly, a Substack newsletter about culture, technology, politics, and art. He lives in Minneapolis."
        },
        {
            id: 7,
            volume: 'I',
            name: "Vanessa Holyoak",
            bio: "Vanessa Holyoak is an LA-based writer of illegible (non) fictions and a maker of opaque installations and performances. Her interdisciplinary writing and art practices—spanning nonfiction, art criticism, and hybrid fiction to intermedial installation and photo poetics—raise questions about cultural and ecological disappearance, taking up the affective dimensions of hybrid and diasporic identity through aesthetic explorations of memory, loss, and opacity. Her first novel, I See More Clearly in the Dark, explores the longing for forestial darkness in an era of hyper-illumination, and was published by Sming Sming Books in 2023."
        },
        {
            id: 8,
            volume: 'I',
            name: "DJ Hills",
            bio: "DJ Hills crafts intimate stories for expansive spaces. Their poetry chapbook Leaving Earth is available from Split Rock Press. Other writing appears most recently in The Worcester Review, Lunch Ticket, and The Thalweg. DJ's plays have been developed with support from the Eugene O'Neill Theater Center, Boston Court Pasadena, Great Plains Theatre Commons, Seven Devils Playwriting Conference, Tofte Lake Center, and elsewhere. Find them online at www.dj-hills.com."
        },
        {
            id: 9,
            volume: 'I',
            name: "Larissa Bates",
            bio: "Larissa Bates was born in Burlington in 1981, and grew up between Vermont and Vara Blanca, Costa Rica. She has had solo exhibitions nationally and internationally, including GNYP Gallery (Berlin), Richard Heller Gallery (Los Angeles), Galeria Espacio Minimo (Madrid), NADA Art Fair (Miami), and Mogadishni (Copenhagen). Her work has been reviewed in The New York Times, The New Yorker, Contemporary Art China, Public Art (Korea), El Cultural (Spain), New York Magazine, Time Out, and KUNSTforum. Collections include the West Collection, Wellington Management, and the 21c Museum Collection. She has been the recipient of the Artadia Award and was a resident artist at the Lower Manhattan Cultural Council. Bates has been represented by Monya Rowe Gallery (New York and St. Augustine) since 2004."
        },
        {
            id: 10,
            volume: 'I',
            name: "Kiara Florez",
            bio: "Kiara Florez is an illustrator who expands upon abstract painting with themes of spirituality, femininity, self-expression, and imaginative worlds. Her latest process on art has taken her works into a more emotional approach, invoking deep, personal meanings as she navigates her healing journey. Kiara currently works full-time in a museum environment as she fuels her creative endeavors by exhibiting in galleries, festivals, and artisan markets across the Eastern Shore."
        },
        {
            id: 11,
            volume: 'I',
            name: "Seth Clark",
            bio: "Seth Clark grew up in Seekonk, Massachusetts and studied close to home in Providence at the Rhode Island School of Design. He earned his BFA in Graphic Design, focusing primarily on print design and alternative typography. During this time, he discovered collage. This method of hands-on, spatial development took a major role in his digital work as well as his physical works on wood and paper. Clark was named Pittsburgh's 2015 Emerging Artist of the Year and was recently awarded an Investing in Professional Artists Grant from the The Pittsburgh Foundation and The Heinz Endowments. His drawings, paintings and sculptures have shown nationally including exhibitions in the Carnegie Museum of Art and the Chautauqua Institution. He currently resides in Pittsburgh, PA and exhibits through galleries, museums and art fairs around the country. Seth is represented by: Paradigm Gallery (Philadelphia, PA), Boxheart Gallery (Pittsburgh, PA), and Momentum Gallery (Asheville, NC)."
        },
        // Volume II Contributors
        {
            id: 12,
            volume: 'II',
            name: "John Paul Brammer",
            bio: "John Paul Brammer is an author and artist from rural Oklahoma currently based in Brooklyn. In 2017, he launched Hola Papi, a popular advice column that became an award-winning book in 2021. His bylines include the New York Times, the Washington Post, GQ, and the New Yorker. His next book, an illustrated young-adult novel titled Samara, will be published next year."
        },
        {
            id: 13,
            volume: 'II',
            name: "Corley Miller",
            bio: "Corley Miller is a teacher at the University of Mary Washington in Virginia. He writes fiction and criticism about the contemporary."
        },
        {
            id: 14,
            volume: 'II',
            name: "Keegan Smith-Nichols",
            bio: "Keegan Smith-Nichols is a librarian living in Iowa who is passionate about stargazing, rockhounding, and houseplants. He is a graduate of Antioch College and the University of Wisconsin-Madison. He can usually be found on the banks of the Cedar River, and his work has appeared in Fruitslice and elsewhere."
        },
        {
            id: 15,
            volume: 'II',
            name: "Kurt David",
            bio: "Kurt David is a public school teacher and unionist. He lives in South Philly with his boyfriend."
        },
        {
            id: 16,
            volume: 'II',
            name: "Hannah Rubin",
            bio: "Hannah Rubin is a writer, artist, and somatic practitioner whose work explores queer ecologies of gender, relationships, ritual, and loss. They live in Los Angeles where they work as a somatic practitioner, run an experimental writing school, and co-host a monthly poetry radio show with Noelle Armstrong on dublab radio."
        },
        {
            id: 17,
            volume: 'II',
            name: "Alex Bechtel",
            bio: "Alex Bechtel creates new works of music, theatre, and musical theatre. He is the recipient of seven Barrymore Awards, an Independence Fellowship in the Arts, and the Next Forever Commission from Princeton University/The Civilians. He lives in New York City, and would like to know what you're reading these days. See and hear more at alexbechtel.com"
        },
        {
            id: 18,
            volume: 'II',
            name: "Nia Watson",
            bio: "Nia Watson is a writer and MFA student at NYU."
        },
        {
            id: 19,
            volume: 'II',
            name: "Shawn Huckins",
            bio: "Shawn Huckins is a New Hampshire based painter whose work examines and challenges contemporary American culture, offering pointed commentary on politics, societal norms, climate change, and the complexities of individual identity in the modern age. He reflects his appreciation of his homeland, all while equally criticizing the nation in a modern millennial fashion that blends irony, social awareness, and a demand for progress."
        },
        {
            id: 20,
            volume: 'II',
            name: "Hailey Zein",
            bio: "Hailey Zein is a Brooklyn-based contemporary artist whose paintings depict claustrophobic interiors that contemplate tense juxtapositions between surface appearance and internal experience."
        },
        {
            id: 21,
            volume: 'II',
            name: "D'Shon McCarthy",
            bio: "D'Shon McCarthy is a Philadelphia-based artist whose work engages with experiences of liminality through the complicated generational materiality negotiated by Black female embodiment."
        }
    ];
    
    const [currentVolume, setCurrentVolume] = useState('I');
    const contributors = allContributors.filter(c => c.volume === currentVolume);
    
    return (
        <div className={`about-container ${theme}`}>
            <div className="about-content">
                <h2 className="about-header">Who We Are</h2>
                
                <div className="about-summary">
                    <p>
                        Primer is an independent literary journal showcasing emerging voices in fiction and creative non-fiction.
                        Our inaugural volume brings together a diverse collection of works that explore the human experience through fresh perspectives and innovative storytelling.
                    </p>
                </div>
                
                <div className="about-credits">
                    <div className="credit-section">
                        <h3>Edited by</h3><p><a href="https://www.phillyqueerbookclub.com/" target="_blank" rel="noopener noreferrer">Daniel Maloney</a></p>
                    </div>
                    
                    <div className="credit-section">
                        <h3>Edited by</h3><p><a href="https://www.maggielangewrites.com/6232796-about" target="_blank" rel="noopener noreferrer">Maggie Lange</a></p>
                    </div>
                    
                    <div className="credit-section">
                        <h3>Curation by</h3><p><a href="http://www.chasendougherty.com/" target="_blank" rel="noopener noreferrer">Chase Dougherty</a></p>
                    </div>
                    
                    <div className="credit-section">
                        <h3>Design by</h3><p><a href="https://www.liam.site" target="_blank" rel="noopener noreferrer">Liam Allaire</a></p>
                    </div>
                </div>

                <div className="contributors-section">
                    <h2 className="contributors-header">Our Contributors</h2>
                    
                    <div className="volume-selector-contributors">
                        <button 
                            className={`volume-btn ${currentVolume === 'I' ? 'active' : ''}`}
                            onClick={() => setCurrentVolume('I')}
                        >
                            Volume I
                        </button>
                        <button 
                            className={`volume-btn ${currentVolume === 'II' ? 'active' : ''}`}
                            onClick={() => setCurrentVolume('II')}
                        >
                            Volume II
                        </button>
                    </div>
                    
                    <div className="contributors-accordion">
                        {contributors.map((contributor) => (
                            <ContributorAccordionItem 
                                key={contributor.id} 
                                contributor={contributor}
                                isOpen={openContributorId === contributor.id}
                                toggleAccordion={() => toggleContributorAccordion(contributor.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;