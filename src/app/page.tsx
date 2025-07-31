'use client'
import Image from "next/image";
import styles from "@/app/login/styles.module.scss";
import React, {useState} from "react";
import {useRouter} from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [activeNestedItem, setActiveNestedItem] = useState<number | null>(null);


    const tabs = [
        {
            name: "Чаты",
            items: [
                "Реакции",
                "Стикеры",
                "Подарки",
                "Системные сообщения"
            ],
            nestedItems: [
                "С кнопкой",
                "Без кнопки"
            ]
        },
        {
            name: "Заметки",
            items: [

            ]
        },
        {
            name: "Регистрация компаний",
            items: [
                "Документы",
                "Лимиты"
            ]
        },
        {
            name: "Маркетплейс",
            items: [

            ]
        },
        {
            name: "Услуги",
            items: [

            ]
        },
        {
            name: "Тарифы",
            items: [
                "Премиум"
            ]
        }
    ];
    return (
        <div className="flex flex-col items-center min-h-screen">
            <header className="bg-cgreen-1 text-cwhite-1 w-8xl rounded-4xl">
                <nav className="container mx-auto flex items-center justify-between">
                    <ul className="flex relative ml-12 text-xl">
                        {tabs.map((tab, index) => (
                            <li key={index} className="px-11 py-3 hover:bg-cgreen-2 relative group flex items-center justify-center"
                                onMouseEnter={() => setActiveTab(index)}
                                onMouseLeave={() => {
                                    setActiveTab(null);
                                    setActiveNestedItem(null);
                                }}>
                                <span className="cursor-pointer">{tab.name}</span>

                                <div className={`absolute top-full left-0 w-full ${activeTab === index ? 'block' : 'hidden'}`}>
                                    <ul className="bg-cwhite-1 text-cgreen-1 z-10 pt-1">
                                        {tab.items.map((item, itemIndex) => (
                                            <li
                                                key={itemIndex}
                                                className={`px-4 py-2 hover:bg-cgreen-4 hover:text-cwhite-1 relative text-center ${itemIndex === tab.items.length - 1 && tab.nestedItems ? 'group/nested' : ''}`}
                                            >
                                                {item}
                                                {itemIndex === tab.items.length - 1 && tab.nestedItems && (
                                                    <div className="absolute left-full top-0 hidden group-hover/nested:block">
                                                        <ul className="bg-cwhite-1 text-cgreen-1 w-[150px] ml-1">
                                                            {tab.nestedItems.map((nestedItem, nestedIndex) => (
                                                                <li key={nestedIndex} className="px-4 py-2 hover:bg-cgreen-4 hover:text-cwhite-1 w-[150px]">
                                                                    {nestedItem}
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
                    <button className="rounded-4xl border-cwhite-1 border-2 py-1 px-2 h-max text-xl" onClick={() => router.push('/login')}>Войти</button>
                    <div className="bg-cwhite-1 w-20 rounded-4xl h-14"></div>
                </nav>
            </header>
            <main className="mt-24 grow-1">
                <h1 className="text-cgreen-1 text-5xl">Выберите страницу</h1>
            </main>
            <footer className="w-8xl h-16 bg-cgreen-1 mt-24 flex">
                <Image src="/logo.svg"
                       alt="logo"
                       width={78}
                       height={41}
                       className="ml-7"/>
                <div className="flex gap-3.5 items-center justify-self-center m-auto">
                    <p className="text-xl text-cwhite-1">Существуем с 2024. По вопросам:</p>
                    <div className="relative flex justify-center">
                        <div className="group flex justify-center">
                            <Image src="/tg.svg"
                                   alt="telegram"
                                   width={65}
                                   height={30} />

                            <div className="absolute hidden group-hover:block bottom-full w-max px-5 py-1 text-sm text-cwhite-1 bg-cgreen-2 rounded-4xl whitespace-nowrap">
                                <p className="text-base">@FerubkoMSU</p>
                            </div>
                        </div>
                    </div>

                </div>

            </footer>
        </div>
    )
}