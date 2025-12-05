import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <div className="flex justify-between">
            <Image src="/logo.png" alt="logo" width={100} height={100}/>
            <div className="flex justify-end p-10 gap-6 text-xl">
                {
                    [
                        {
                            rout: "/sign-in", label: "Sign in"}, {rout: "/sign-up", label: "Sign up"
                        }
                        ].map(({rout, label}, i) => {
                                return (
                                    <Link key={i} href={rout} className="border-2 p-3 backdrop-blur-2xl border-white rounded-full transition-colors duration-600  hover:bg-[#1B4565] font-light">{label}</Link>
                                )
                        })
                }
            </div>
        </div>
    );
}