import "./MenuBar.css";

const menuItems = [
    {
        title: "Home",
        icon: "⌂",
        active: false,
        onClick: () => {
            console.log("Home clicked");
        },
    },
    {
        title: "Study",
        icon: "📖",
        active: false,
        onClick: () => {
            console.log("Study clicked");
        },
    },
    {
        icon: "AI",
        active: true,
        onClick: () => {
            console.log("AI clicked");
        },
    },
    {
        title: "Work",
        icon: "💼",
        active: false,
        onClick: () => {
            console.log("Work clicked");
        },
    },
    {
        title: "Me",
        icon: "👤",
        active: false,
        onClick: () => {
            console.log("Me clicked");
        },
    },
];

const MenuBar = () => {
    return (
        <div className="menuBar">
            {menuItems.map((item, index) => (
                <button
                    key={index}
                    className={`menuItem ${item.active ? "activeMenu" : ""}`}
                    onClick={item.onClick}
                >
                    <div className="menuIcon">
                        {item.icon}
                    </div>

                    <p>{item.title}</p>
                </button>
            ))}
        </div>
    );
};

export default MenuBar;