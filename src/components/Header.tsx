import React, {useState} from "react";
import {useRouter} from "next/navigation";

export default function Header() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [activeNestedItem, setActiveNestedItem] = useState<number | null>(null);
    const handleTabClick = (url: string) => {
        console.log('tab')
        router.push(url);
    };

    // Обработчик клика по подпункту
    const handleItemClick = (url: string) => {
        console.log('item')
        router.push(url);
        setActiveTab(null); // Закрываем выпадающее меню
    };
    const tabs = [
        {
            name: "Чаты",
            url: "/",
            items: [
                { title: "Реакции", url: "/" },
                { title: "Стикеры", url: "/" },

                { title: "Системные сообщения", url: "/" }
            ],
            nestedItems: [
                { title: "С кнопкой", url: "/" },
                { title: "Без кнопки", url: "/" }
            ]
        },
        {
            name: "Заметки",
            url: "/",
            items: [
                { title: "Теги", url: "/tags" }
            ]
        },
        {
            name: "Регистрация компаний",
            url: "/",
            items: [
                { title: "Документы", url: "/" },
                { title: "Лимиты", url: "/" }
            ]
        },
        {
            name: "Маркетплейс",
            url: "/",
            items: [

            ]
        },
        {
            name: "Услуги",
            url: "/",
            items: [

            ]
        },
        {
            name: "Тарифы",
            url: "/",
            items: [
                { title: "Премиум", url: "/" }
            ]
        }
    ];
    return (
    <header className="bg-cgreen-1 text-cwhite-1 w-8xl rounded-4xl">
        <nav className="container mx-auto flex items-center justify-between">
            <ul className="flex relative ml-12 text-xl">
                {tabs.map((tab, index) => (
                    <li key={index} className=" relative group flex items-center justify-center h-max"
                        onMouseEnter={() => setActiveTab(index)}
                        onMouseLeave={() => {
                            setActiveTab(null);
                            setActiveNestedItem(null);
                        }}

                    >
                        <button className="px-11 py-3 hover:bg-cgreen-2 flex" onClick={() => handleTabClick(tab.url)}>
                            {tab.name}
                        </button>


                        <div className={`absolute top-full left-0 w-full ${activeTab === index ? 'block' : 'hidden'}`}>
                            <ul className="bg-cwhite-1 text-cgreen-1 z-10 pt-1">
                                {tab.items.map((item, itemIndex) => (
                                    <li
                                        key={itemIndex}
                                        className={`h-max relative ${itemIndex === tab.items.length - 1 && tab.nestedItems ? 'group/nested' : ''}`}
                                    >
                                        <button
                                            className="px-4 py-2 w-full hover:bg-cgreen-4 hover:text-cwhite-1 text-center"
                                            onClick={() => handleItemClick(item.url)}>
                                            {item.title}
                                        </button>
                                        {itemIndex === tab.items.length - 1 && tab.nestedItems && (
                                            <div className="absolute left-full top-0 hidden group-hover/nested:block">
                                                <ul className="bg-cwhite-1 text-cgreen-1 w-[150px] ml-1">
                                                    {tab.nestedItems.map((nestedItem, nestedIndex) => (
                                                        <li key={nestedIndex} className=" w-[150px]">
                                                            <button
                                                                className="px-4 py-2 hover:bg-cgreen-4 hover:text-cwhite-1 w-full text-center"
                                                                onClick={() => handleItemClick(nestedItem.url)}>
                                                                {nestedItem.title}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
            <button className="rounded-4xl border-cwhite-1 border-2 py-1 px-2 h-max text-xl"
                    onClick={() => router.push('/login')}>Войти
            </button>
            <div className="bg-cwhite-1 w-20 rounded-4xl h-14"></div>
        </nav>
    </header>
    )
}