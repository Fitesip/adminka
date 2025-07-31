'use client'
import Image from "next/image";
import styles from "./styles.module.scss";
import React, { useState, ChangeEvent, FormEvent, FocusEvent } from "react";
import {useRouter} from "next/navigation";

type FormData = {
    email: string;
    password: string;
};

type FormErrors = {
    email: string;
    password: string;
    global: string;
};

export default function Home() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<FormErrors>({
        email: '',
        password: '',
        global: '',
    });
    const [loginStatus, setLoginStatus] = useState({
        status: '',
    })

    // Проверка всех полей
    const validateForm = (): boolean => {
        // Сначала сбрасываем все ошибки
        setErrors({
            email: '',
            password: '',
            global: '',
        });

        // Проверка на пустые поля
        if (!formData.email.trim() && !formData.password.trim()) {
            setErrors(prev => ({
                ...prev,
                global: '*Заполните все поля',
            }));
            document.getElementsByName('email')[0].className = document.getElementsByName('email')[0].className.replace("bg-corange-6 border-corange-3", "bg-cred-1 border-corange-1");
            document.getElementsByName('password')[0].className = document.getElementsByName('password')[0].className.replace("bg-corange-6 border-corange-3", "bg-cred-1 border-corange-1");
            return false;
        }

        // Индивидуальная валидация
        const newErrors: Partial<FormErrors> = {};

        if (!formData.email.trim()) {
            newErrors.email = '*Это обязательное поле';
            document.getElementsByName('email')[0].className = document.getElementsByName('email')[0].className.replace("bg-corange-6 border-corange-3", "bg-cred-1 border-corange-1");
        } else if (!formData.email.includes('@')) {
            newErrors.email = '*Email должен содержать @';
            document.getElementsByName('email')[0].className = document.getElementsByName('email')[0].className.replace("bg-corange-6 border-corange-3", "bg-cred-1 border-corange-1");
        } else if (formData.email.trim() && formData.email.includes('@')) {
            document.getElementsByName('email')[0].className = document.getElementsByName('email')[0].className.replace("bg-cred-1 border-corange-1", "bg-corange-6 border-corange-3");
        }

        if (!formData.password.trim()) {
            newErrors.password = '*Это обязательное поле';
            document.getElementsByName('password')[0].className = document.getElementsByName('password')[0].className.replace("bg-corange-6 border-corange-3", "bg-cred-1 border-corange-1");
        } else if (formData.password.length < 8) {
            newErrors.password = '*Пароль должен быть не менее 8 символов';
            document.getElementsByName('password')[0].className = document.getElementsByName('password')[0].className.replace("bg-corange-6 border-corange-3", "bg-cred-1 border-corange-1");
        } else if (formData.password.length >= 8 && formData.password.trim()) {
            document.getElementsByName('password')[0].className = document.getElementsByName('password')[0].className.replace("bg-cred-1 border-corange-1", "bg-corange-6 border-corange-3");
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Сбрасываем ошибку при вводе
        if (errors.global) {
            setErrors(prev => ({ ...prev, global: '' }));
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
        validateForm();
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (validateForm()) {
            document.getElementsByName('login')[0].className += ' bg-corange-2';
            document.getElementsByName('login')[0].innerHTML = '<img src="/loading.gif" alt="loading"/>'
            try {
                const response = await fetch('https://testapi.animalmore.ru/auth/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email: formData.email, password: formData.password}),
                    credentials: 'include'
                })
                const json = await response.json();

                if (response.status === 200) {
                    localStorage.setItem('token', json.accessToken);
                    localStorage.setItem('role', json.user.role);
                    router.push('/login/success')
                }
                else if (response.status === 401) {
                    setLoginStatus(prev => ({...prev, status: 'Неправильный логин или пароль'}))
                }
                else if (response.status === 403) {
                    router.push('/login/success')
                }
                else if (response.status === 400) {
                    router.push('/login/error')
                }
            }
            catch (error) {
                router.push('/login/error')
            }
        }
    }
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
        <div className="flex flex-col items-center">
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
                    <button className="rounded-4xl border-cwhite-1 border-2 py-1 px-2 h-max text-xl">Войти</button>
                    <div className="bg-cwhite-1 w-20 rounded-4xl h-14"></div>
                </nav>
            </header>
            <main className="mt-24">
                <div
                    className="bg-corange-4 border-corange-5 border-2 flex flex-col items-center w-[756px] min-h-[744px] p-5">
                    <div className="mt-7 flex flex-col items-center">
                        <Image
                            src="/profile.svg"
                            className={styles.loginImage}
                            alt="profile-image"
                            width={52}
                            height={86}
                        />
                        <h3 className="text-2-5xl text-center">Вход в аккаунт</h3>
                        <p className="text-xl text-center text-corange-2">
                            Для доступа к этому разделу вам нужны особые права
                        </p>
                    </div>
                    <form className="flex flex-col gap-11 text-xl mt-10" onSubmit={handleSubmit}>
                        {loginStatus.status && (
                            <p className="text-red-500 text-xl text-center">{loginStatus.status}</p>
                        )}
                        <label htmlFor="email" className="text-xl flex flex-col gap-3.5">Логин
                            <input type="text" required placeholder="admin@gmail.com" name="email"
                                   className="bg-corange-6 border-corange-3 border-2 rounded-sm p-5 w-lg text-2xl"
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   value={formData.email}/>
                            {errors.email && !errors.global && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </label>
                        <label htmlFor="password" className="text-xl flex flex-col gap-3.5">Пароль
                            <input type="password" required placeholder=".........." name="password"
                                   className="bg-corange-6 border-corange-3 border-2 rounded-sm p-5 w-lg text-2xl"
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   value={formData.password}/>
                            {(errors.password || errors.global) && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.global || errors.password}
                                </p>
                            )}
                        </label>
                        <label htmlFor="remember-me"
                               className="flex flex-row-reverse self-start gap-4 items-center">Запомнить вход
                            <input type="checkbox" name="remember-me"
                                   className="appearance-none w-11 h-11 border-2 border-corange-3 rounded-sm checked:bg-corange-1 checked:border-corange-3 checked:rounded-4xl transition-all"/>
                        </label>
                        <button type="submit" name="login"
                                className="bg-corange-1 text-white border-corange-3 border-2 rounded-sm pb-5 pt-5 w-auto flex justify-center transition-all hover:bg-corange-2 text-2xl">Вход
                        </button>
                    </form>
                </div>
            </main>
            <footer className="w-8xl h-16 bg-cgreen-1 mt-24 flex">
                <Image src="/logo.svg"
                       alt="logo"
                       width={78}
                       height={41}
                       className="ml-7"/>
                <div className="flex gap-3.5 items-center justify-self-center m-auto">
                    <p className="text-xl text-cwhite-1 -ml-7">Существуем с 2024. По вопросам:</p>
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
    );
}
