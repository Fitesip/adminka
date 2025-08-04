'use client'
import Image from "next/image";
import styles from "@/app/login/styles.module.scss";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import Header from '@/components/Header';

export default function Home() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [activeNestedItem, setActiveNestedItem] = useState<number | null>(null);


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
        <div className="flex flex-col items-center min-h-screen">
            <Header />
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