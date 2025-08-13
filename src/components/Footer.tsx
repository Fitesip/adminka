import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-8xl h-16 bg-cgreen-1 mt-24 flex rounded-4xl">
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
    )
}

