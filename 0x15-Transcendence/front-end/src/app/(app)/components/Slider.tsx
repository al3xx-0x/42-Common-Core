import {ReactNode, useContext, useEffect, useState} from "react";
import {Range} from "react-range";

export type SliderProps = {
    title: string;
    subtitle: string;
    initial: number;
    minValue: number;
    maxValue: number;
    action: (val: number) => void;
}

export default function Slider({title, subtitle, initial,  minValue, maxValue, action} : SliderProps) {
    const [values, setValues] = useState([0]);

    useEffect(() => {
        setValues([initial]);
    }, [initial]);

    return (
        <div className="w-full  px-4">
            <div className='flex justify-between py-4 -ml-4'>
                <h2 className='text-[#a4aca7]  text-lg color'>{title}</h2>
                <h2 className='text-[#D9D9D9] text-center'>{subtitle}</h2>
            </div>
            <Range
                step={1}
                min={0}
                max={3}
                values={values}
                onChange={(values) => {
                    action(values[0])
                    setValues(values)
                }}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        className='border border-[#498195]/30 bg-[#113A4B]/50 relative'
                        style={{
                            ...props.style,
                            height: "22px",
                            borderRadius: "50px",
                            width: "100%",
                        }}
                    >
                        {Array.from({ length: maxValue  }, (_, i) => (
                            i !== 0 &&
                            <div
                                key={i}
                                className="absolute top-1/2 transform -translate-y-1/2 w-1 h-full  bg-[#498195]/50"
                                style={{
                                    left: `${(i / maxValue) * 100}%`,
                                }}
                            />
                        ))}
                        {children}
                    </div>
                )}
                renderThumb={({ props, isDragged }) => {
                    return (
                        <div
                            {...props}
                            className='w-8 h-8 transition-all duration-300 bg-[#113A4B] border-2 border-[#498195] focus:border-[#23ccdc] focus:ring-0'
                            style={{
                                ...props.style,
                                borderRadius: "50px",
                                backgroundColor: isDragged ? "#23ccdc" : "#113A4B",
                            }}
                        />
                    );
                }}
            />
        </div>
    );
}