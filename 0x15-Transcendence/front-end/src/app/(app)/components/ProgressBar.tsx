export type progressProps = {
    value: number;
}
export default function ProgressBar(props: progressProps) {
    return (
        <div className="relative w-full h-7 bg-[#081C29]/80 rounded-full border border-[#666262] overflow-hidden">
            <div
                className="bg-[#10B6FC] h-full rounded-full"
                style={{ width: `${props.value}%` }}
            />
            <span className="absolute inset-0 flex justify-center items-center text-xs font-semibold">
                5000/5000px
            </span>
        </div>

    );
}