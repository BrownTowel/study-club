/**
 * 特設ページ
 */
import { Prisma } from "@prisma/client";
import { client } from "@/prisma/client";

const STATUS_ENABLE = "01";

interface Account {
    id: number;
    address: string;
    registerName: string;
    displayName: string;
    class: string;
    status: string;
    password: string | null;
    remarks: string | null;
    loginDatetime: string | null;
    videoConnectionDatetime: string | null;
    createAccountId: number;
    createTimestamp: Date;
    updateAccountId: number;
    updateTimestamp: Date;
}

export default function index( { accounts }: { accounts: string; } ) {

    return (
        <>
        <style>{`
            body {
                background: none;
            }
        `}</style>
        <main>
            <ul>
                {
                    JSON.parse( accounts )
                        .map( ( account: Account ) => {
                            return <li key={account.id}>{ account.displayName }</li>
                        }) 
                }
            </ul>
        </main>
        </>
    )
}

export async function getStaticProps() {

    const query_option: Prisma.AccountFindManyArgs = { where: { status: STATUS_ENABLE } };

    const accounts = JSON.stringify( await client.account.findMany( query_option ) );

    return { props: { accounts } };
}
  