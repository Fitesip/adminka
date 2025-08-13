// utils/mediaProcessor.ts
interface MediaResourceInput {
    id: string;
    url: string;
    type: string;
}

export interface MediaResult {
    url: string;
    blobUrl?: string;
    error?: string;
    type: 'static' | 'motion';
    metadata?: {
        duration?: number;
        width?: number;
        height?: number;
    };
}

export interface MediaResourceOutput {
    url: string;
    id: string;
    type: string;
    media: MediaResult[];
}

const MEDIA_TYPES = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'],
    video: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv']
};

function getMediaType(url: string): 'static' | 'motion' {
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension && MEDIA_TYPES.video.includes(extension)) return 'motion';
    return 'static'; // По умолчанию считаем изображением
}

export async function createMediaPromises(
    urlResources: MediaResourceInput[]
): Promise<MediaResourceOutput[]> {
    // Создаем структуру выходных данных с originalUrl
    const resourcesWithMedia: MediaResourceOutput[] = urlResources.map(resource => ({
        url: resource.url, // Используем url как originalUrl
        id: resource.id,
        type: resource.type,
        media: [{
            url: resource.url,
            type: resource.type === 'motion' ? 'motion' : 'static',
            blobUrl: undefined,
            error: undefined,
            metadata: undefined
        }]
    }));

    // Загрузка медиа-данных (остается без изменений)
    await Promise.all(
        resourcesWithMedia.map(async resource => {
            await Promise.all(
                resource.media.map(async media => {
                    try {
                        const response = await fetch(media.url);
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);

                        const blob = await response.blob();
                        media.blobUrl = URL.createObjectURL(blob);

                        if (media.type === 'motion') {
                            await new Promise<void>((resolve) => {
                                const videoElem = document.createElement('video');
                                videoElem.src = media.blobUrl!;
                                videoElem.onloadedmetadata = () => {
                                    media.metadata = {
                                        duration: videoElem.duration,
                                        width: videoElem.videoWidth,
                                        height: videoElem.videoHeight
                                    };
                                    resolve();
                                };
                                videoElem.onerror = () => resolve();
                            });
                        }
                    } catch (err) {
                        media.error = err instanceof Error ? err.message : 'Loading failed';
                    }
                })
            );
        })
    );

    return resourcesWithMedia;
}