import "./HalfTop.css";

const topCards = [
    {
        title: "AI同传",
        className: "orangeCard",
    },
    {
        title: "文档翻译",
        className: "blueCard",
    },
    {
        title: "AI口语",
        className: "purpleCard",
    },
];

const features = [
    "Camera",
    "Word",
    "Voice",
    "Correction",
    "Translate W...",
    "Vocabulary",
    "Hearing",
    "Perusing",
    "AI Paper Tr...",
    "More",
];

const HalfTop = () => {
    return (
        <div className="halfTop">
            <div className="backgroundGlow"></div>

            <div className="topBar">
                <div className="profile"></div>

                <div className="language">
                    English/ Chinese
                    <span>▼</span>
                </div>

                <button className="generalBtn">
                    General
                </button>
            </div>

            <div className="searchBar">
                <input
                    type="text"
                    placeholder="Enter your words or sentences..."
                />

                <div className="searchIcons">
                    <span>🎤</span>
                    <span>⛶</span>
                </div>
            </div>

            <div className="topCards">
                {topCards.map((card, index) => (
                    <div
                        key={index}
                        className={`topCard ${card.className}`}
                    >
                        <h2>{card.title}</h2>
                    </div>
                ))}
            </div>

            <div className="featureGrid">
                {features.map((feature, index) => (
                    <button
                        key={index}
                        className="featureCard"
                    >
                        <div className="featureIcon"></div>
                        <p>{feature}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HalfTop;