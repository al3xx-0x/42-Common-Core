'use client'
import React from 'react';

const RadarScanner = () => {
    return (
        <div className=" w-[256px] h-[256px] flex items-center justify-center">
            {/* Outer glow effect */}
            <div className="absolute  inset-0 bg-gradient-radial from-cyan-500/5 via-cyan-500/2 to-transparent rounded-full blur-xl" />

            {/* Main radar container */}
            <div className="relative w-full h-full backdrop-blur-sm rounded-full border border-cyan-400/20 overflow-hidden">

                {/* Background grid pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `
                radial-gradient(circle at center, rgba(34, 211, 238, 0.3) 1px, transparent 1px),
                linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
              `,
                            backgroundSize: '20px 20px, 40px 40px, 40px 40px'
                        }}
                    />
                </div>

                {/* Concentric circles with different opacities and animations */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute border rounded-full ${
                                i === 0 ? 'border-cyan-300/60' :
                                    i === 1 ? 'border-cyan-400/50' :
                                        i === 2 ? 'border-cyan-400/40' :
                                            i === 3 ? 'border-cyan-500/30' :
                                                'border-cyan-600/20'
                            }`}
                            style={{
                                width: `${60 + i * 55}px`,
                                height: `${60 + i * 55}px`,
                                filter: i < 2 ? 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.3))' : 'none'
                            }}
                        />
                    ))}
                </div>

                {/* Crosshair lines with glow */}
                {/*<div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent transform -translate-x-0.5"*/}
                {/*     style={{ filter: 'drop-shadow(0 0 2px rgba(34, 211, 238, 0.4))' }} />*/}
                {/*<div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transform -translate-y-0.5"*/}
                {/*     style={{ filter: 'drop-shadow(0 0 2px rgba(34, 211, 238, 0.4))' }} />*/}

                {/* Diagonal crosshairs */}
                {/*<div className="absolute top-0 left-0 w-full h-full">*/}
                {/*    <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform rotate-45 origin-center top-1/2 -translate-y-0.5" />*/}
                {/*    <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform -rotate-45 origin-center top-1/2 -translate-y-0.5" />*/}
                {/*</div>*/}

                {/* Center core with pulsing effect */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-30 animate-ping" />
                        <div
                            className="w-4 h-4 rounded-full bg-cyan-400"
                            style={{
                                filter: "drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))",
                                boxShadow: "0 0 16px rgba(34, 211, 238, 0.6), inset 0 0 8px rgba(255,255,255,0.3)"
                            }}
                        />
                    </div>
                </div>


                {/* Main scanning beam with advanced gradient */}
                <div
                    className="absolute h-full w-full  top-1/5 left-1/5 origin-center transform"
                    style={{
                        background: 'conic-gradient(from 90deg, rgba(34, 211, 238, 0.15) 0deg, rgba(34, 211, 238, 0.15) 20deg, rgba(34, 211, 238, 0.15) 20%, transparent 60deg, transparent 100%)',
                        animation: 'radarSweep 4s  infinite',
                        filter: 'blur(1px)',
                        borderRadius: '2px'
                    }}
                />

                {/* Detection blips with variety */}
                <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                    style={{
                        filter: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.8))',
                        animationDuration: '2s'
                    }} />

                <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"
                     style={{
                         filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))',
                         animationDelay: '0.8s',
                         animationDuration: '1.5s'
                     }} />

                <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse"
                     style={{
                         filter: 'drop-shadow(0 0 10px rgba(248, 113, 113, 0.8))',
                         animationDelay: '1.6s',
                         animationDuration: '2.5s'
                     }} />

                <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-cyan-300 rounded-full animate-pulse"
                     style={{
                         filter: 'drop-shadow(0 0 4px rgba(103, 232, 249, 0.8))',
                         animationDelay: '2.4s',
                         animationDuration: '1.8s'
                     }} />

                <div className="absolute bottom-1/4 right-2/5 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"
                     style={{
                         filter: 'drop-shadow(0 0 6px rgba(196, 181, 253, 0.8))',
                         animationDelay: '3.2s',
                         animationDuration: '2.2s'
                     }} />

                {/* Outer rim glow */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                     style={{
                         filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.3))',
                         background: 'radial-gradient(circle at center, transparent 98%, rgba(34, 211, 238, 0.1) 100%)'
                     }} />

                {/* Inner subtle glow rings */}
                {/*<div className="absolute inset-4 rounded-full border border-cyan-300/20" />*/}
                {/*<div className="absolute inset-8 rounded-full border border-cyan-200/15" />*/}
            </div>

            {/* Corner targeting brackets */}
            {/* <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400/60"
                 style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.4))' }} />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400/60"
                 style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.4))' }} />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400/60"
                 style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.4))' }} />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400/60"
                 style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.4))' }} /> */}

            <style jsx> {`
                @keyframes radarSweep {
                    0% {
                        transform:  rotate(0deg);
                    }
                    100% {
                        transform:  rotate(360deg);
                    }
                    }
                `}
            </style>
        </div>
    );
};

export default RadarScanner;