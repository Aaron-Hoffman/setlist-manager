import 'next-auth';
import { Prisma } from '@prisma/client';

const bandWithRelations = Prisma.validator<Prisma.BandArgs>()({
    include: {
        songs: true,
        setLists: true,
    },
});

type BandWithRelations = Prisma.BandGetPayload<typeof bandWithRelations>;

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
        user: {
            bands: BandWithRelations[];
        } & DefaultSession['user'];
    }

    interface User {
        bands: BandWithRelations[];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
    }
}

