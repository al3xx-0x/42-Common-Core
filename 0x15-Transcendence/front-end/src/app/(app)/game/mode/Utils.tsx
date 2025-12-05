export const gradient = "bg-gradient-to-r from-[#188C71] to-[#10B6FC]"
export const gradientBorder = "border-gradient-to-r from-[#188C71] to-[#10B6FC]"

export const dark_blue = "#081C29"
export const electric_blue  = "#00F5ff"

export enum Pos {
    TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT
}
export function CornerDecoration(pos: Pos) {
    const size = 100;

    const rotationMap: Record<Pos, string> = {
        [Pos.TOP_LEFT]: 'rotate-0',
        [Pos.TOP_RIGHT]: 'rotate-90',
        [Pos.BOTTOM_LEFT]: '-rotate-90',
        [Pos.BOTTOM_RIGHT]: 'rotate-180',
    };

    return (
        <div className={rotationMap[pos]}>
            <svg width={size} height={size}>
                <defs>
                    <linearGradient id="cornerGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#188C71" />
                        <stop offset="100%" stopColor="#10B6FC" />
                    </linearGradient>
                </defs>
                <path
                    d="M0,0 L0,60 L4,60 L4,4 60,4 60,0 Z"
                    fill="url(#cornerGradient)"
                />
            </svg>
        </div>
    );
}
