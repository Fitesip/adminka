'use client'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React, {useEffect, useState} from "react";
import { createMediaPromises, type MediaResourceOutput, type MediaResult } from '@/utils/mediaProcessor';
import Image from "next/image";

interface Reaction {
    "_id": string;
    "reactionPack": string;
    "s3Id": string;
    "createdAt": string;
    "updatedAt": string;
}
interface ReactionPack {
    "_id": string;
    "name": string;
    "type": string;
    "status": string;
    "whiteRoleList": Array<any | null>[];
    "blackRoleList": Array<any | null>[];
    "praiseList": Array<any | null>[];
    "ageRestrictions": string;
    "reactionList": Reaction[];
    "cloudUrl": string;
    "cover": string;
    "fileExtension": string;
    "createdAt": string;
    "updatedAt": string;
}
interface MediaItem {
    id: string;
    url: string;
    type: string;
}
interface AvailableReaction {
    _id: string;
    name: string;
    type: string;
    status: string;
    whiteRoleList: Array<any>[];
    blackRoleList: Array<any>[];
    ageRestrictions: string;
    reactionList: MediaResourceOutput[];
    cover: string | undefined | null;
}
interface ExampleReaction {
    "reaction": string;
    "type": string;
}
export default function Home() {
    const [reactionPacks, setReactionPacks] = useState<ReactionPack[]>([]);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [reactionsList, setReactionsList] = useState<MediaResourceOutput[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [availableReactions, setAvailableReactions] = useState<AvailableReaction[]>([]);
    const [exmapledReactions, setExmapledReactions] = useState<ExampleReaction>();

    const getReactionPacks = async () => {
        try {
            const response = await fetch("https://testapi.animalmore.ru/chat-admin/chat-admin/api/v1/reactionpacks/", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            })
            if (!response.ok) {
                setError('Ошибка HTTP: ' + response.status);
            }
            const data = await response.json();
            setReactionPacks(data)

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage)
        }
    }
    useEffect(() => {
        getReactionPacks().then(r => {

        }).then(r => {

        })
    }, []);
    useEffect(() => {
        const loadMedia = async () => {
            if (reactionPacks.length > 0) {
                try {
                    const urlResources = generateMediaFetchData(reactionPacks);
                    const loadedResources = await createMediaPromises(urlResources);
                    setReactionsList(loadedResources);
                } catch (err) {
                    console.error('Media processing failed:', err);
                }
            }
        };

        loadMedia();
        // Очистка
        return () => {
            reactionsList.forEach((resource: MediaResourceOutput) => {
                resource.media.forEach((media: MediaResult) => {
                    if (media.blobUrl) URL.revokeObjectURL(media.blobUrl);
                });
            });
        };
    }, [reactionPacks]);
    const generateMediaFetchData = (reactionPacks: ReactionPack[]) => {
        const dataList: MediaItem[] = []
        reactionPacks.map(reactionPack => {
            reactionPack.reactionList.map(reaction => {
                const url = `${reactionPack.cloudUrl.endsWith("/") ? reactionPack.cloudUrl : reactionPack.cloudUrl + "/"}${reaction.s3Id}`
                const data = {
                    id: reaction._id,
                    url: url,
                    type: reactionPack.type,
                }
                dataList.push(data)
            })
        })
        setMediaItems(dataList);
        return dataList;
    };

    useEffect(() => {
        const groupReactionsByPacks =  (): AvailableReaction[] => {
            return reactionPacks.map(pack => {
                const packReactions = reactionsList.filter(reaction =>
                    pack.reactionList.some(packReaction => packReaction._id === reaction.id)
                );
                const coverReactionId = pack.cover

                let coverMedia: MediaResourceOutput | undefined | null = reactionsList.find(media => media.id === coverReactionId);

                if (!coverMedia) {
                    coverMedia = null;
                }
                return {
                    _id: pack._id,
                    name: pack.name,
                    type: pack.type,
                    status: pack.status,
                    whiteRoleList: pack.whiteRoleList,
                    blackRoleList: pack.blackRoleList,
                    ageRestrictions: pack.ageRestrictions,
                    reactionList: packReactions,
                    cover: coverMedia?.media[0].blobUrl,
                };
            }).filter(pack => pack.reactionList.length > 0);
        };


        // Получаем сгруппированные реакции
        setAvailableReactions(groupReactionsByPacks());
    }, [reactionsList]);

    const exmapleReaction = (reaction: string, type: string) => {
        const data = {
            reaction,
            type,
        }
        setExmapledReactions(data)
    }

    const renderReactionPack = (pack: AvailableReaction, index: number) => (
        <div key={pack._id} className="reaction-pack flex flex-col bg-cwhite-1 border border-corange-1 rounded-md p-4 min-w-xl"
        onClick={() => setActiveTab(index)}>
            <div className="pack-header flex items-center gap-3">
                {pack._id && (
                    pack.type === 'static' ? (
                    <img
                        src={pack.cover ? pack.cover : undefined}
                        alt={pack.name}
                        className="pack-cover w-24 h-24"
                    />) : (
                        <video
                            src={pack.cover ? pack.cover : undefined}
                            autoPlay
                            muted
                            loop
                            className="pack-cover w-24 h-24"
                        />)
                    )
                }
                <div className="flex flex-col">
                    <h3 className="pack-name">{pack.name}</h3>
                    <h4>{pack.type === 'static' ? 'Статичный' : "Анимированный"}</h4>
                    <h5>{pack.status === 'public' ? "Публичный" : "Приватный"}</h5>
                </div>
                <Image src="/arrow.svg" alt="arrow" width={40} height={40} className={`${activeTab === index ? "rotate-90" : ""} transition-all justify-self-end ml-auto`} />
            </div>
            <div className="flex flex-col gap-3">
                <div className={`pack-reactions ${activeTab === index ? "max-h-64 mt-4" : "max-h-0 mt-0"} overflow-hidden transition-all flex gap-3 flex-wrap max-w-[512px]`}>
                    {pack.reactionList.map(reaction => (
                        <div key={reaction.id} className="reaction-item">
                            {reaction.media.map((media, index) => (
                                media.type === 'static' ? (
                                    <img
                                        key={`${reaction.id}-${index}`}
                                        src={media.url}
                                        alt=""
                                        className="reaction-media w-24 h-24"
                                        onClick={() => {exmapleReaction(media.url, reaction.type)}}
                                    />
                                ) : (
                                    <video
                                        key={`${reaction.id}-${index}`}
                                        src={media.url}
                                        className="reaction-media w-24 h-24"
                                        autoPlay
                                        loop
                                        muted
                                        onClick={() => {exmapleReaction(media.url, reaction.type)}}
                                    />
                                )
                            ))}
                        </div>
                    ))}
                    <Image src="/+.svg" alt="+" width={60} height={60} className="border border-black rounded-full h-max mt-4"/>
                </div>
                <div className="">
                    {exmapledReactions && activeTab === index && (
                        <div className="relative bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow size-max">
                            <div className="text-gray-800">Пример реакции в сообщении</div>
                                <div className="flex gap-2 mt-2">
                                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 hover:scale-125 transition-all`}>
                                        {exmapledReactions.type === 'static' ? (
                                            <img
                                                src={exmapledReactions.reaction}
                                                alt=""
                                                className="reaction-media w-6 h-6"
                                            />
                                        ) : (
                                            <video
                                                src={exmapledReactions.reaction}
                                                className="reaction-media w-6 h-6"
                                                autoPlay
                                                loop
                                                muted
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                </div>
            </div>


        </div>
    );

    return (
        <div className="flex flex-col items-center min-h-screen">
            <Header/>
            <main className="flex flex-col items-center grow-1">
                <div className="flex justify-between text-lg gap-20">
                    <div className="flex flex-wrap max-w-xl justify-start gap-4 text-lg mt-12">
                        {error && <div className="text-cred-2">
                            Ошибка загрузки паков реакций!<br/>
                            {error}
                        </div>}
                        <div className="reaction-packs-container flex gap-5 flex-col ">
                            {availableReactions.length > 0 ? (
                                availableReactions.map(renderReactionPack)
                            ) : (
                                <p className="no-reactions-message">Нет доступных реакций</p>
                            )}
                        </div>
                    </div>
                </div>

            </main>
            <Footer/>
        </div>

    );
};


