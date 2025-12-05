import React from "react";
import {Loader} from "lucide-react";

export default function Loading({isloading, label, size = 24, color = '#fff'} :{isloading: boolean, label?: string, size?: number, color?: string}) {
    return <div>
        {isloading ? <Loader color={color} size={size} className='animate-spin'/> : label }
    </div>
}