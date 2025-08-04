'use client'
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import Header from '@/components/Header';

export default function Home() {
    const router = useRouter();
    let access = false

    const role = localStorage.getItem("role");
    access = role == 'ADMIN';
    return (
        <div className="flex flex-col items-center min-h-screen">
            <Header />
            <main className="mt-36">
                <div
                    className="bg-corange-4 border-corange-5 border-2 flex flex-col items-center justify-between w-[756px] min-h-[744px] p-5">
                    <div className="mt-7 flex flex-col items-center">
                        <Image
                            src="/profile.svg"
                            alt="profile-image"
                            width={52}
                            height={86}
                        />
                        <h3 className="text-2-5xl text-center">Вход в аккаунт</h3>
                        <p className="text-xl text-center text-corange-2">
                            Для доступа к этому разделу вам нужны особые права
                        </p>
                    </div>
                    {(access) && (<h1 className="text-corange-1 text-2-5xl text-center">Вы успешно вошли в аккаунт!</h1>)}
                    {(access) &&
                        (<button type="button"
                                 className="bg-corange-1 text-white border-corange-3 border-2 rounded-sm pb-5 pt-5 flex justify-center transition-all w-xl text-2xl hover:bg-corange-2" onClick={() => router.push('/')}>Прододжить
                            </button>)}

                    {(!access) && (<h1 className="text-corange-1 text-2-5xl text-center">Ошибка!<br/>У вас недостаточно прав доступа</h1>)}
                    {(!access) &&
                        (<button type="button"
                                 className="bg-corange-1 text-white border-corange-3 border-2 rounded-sm pb-5 pt-5 flex justify-center transition-all w-xl text-2xl hover:bg-corange-2" onClick={() => router.push('/')}>Вернуться на главную
                            </button>)}
                </div>
            </main>
            <footer className="w-full h-24 bg-gray-100 mt-36">

            </footer>
        </div>
    );
}