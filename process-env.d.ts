declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            PORT: string;
            MONGO_HOST: string;
            MONGO_PORT: string;
            MONGO_USERNAME: string;
            MONGO_PASSWORD: string;
            EMAIL_HOST: string;
            EMAIL_USERNAME: string;
            EMAIL_PASSWORD: string;
            BASE_URL: string;
        }
    }
}

export {}