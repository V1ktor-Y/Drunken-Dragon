import { TurnTracker } from './TurnTracker';
import { ZoomSlider } from './ZoomSlider';

export function Stage() {
  return (
    <main className="relative flex flex-1 overflow-hidden border-r border-[#fcfcfc] bg-[#131316]">
      <TurnTracker />

      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(#333338 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.5,
        }}
      ></div>

      <ZoomSlider />

      {/* Empty Grid Indicator */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="border border-[#333338] bg-[#131316] p-8">
          <p className="font-label-mono uppercase text-label-mono text-[#88919d]">
            Awaiting Tactical Data...
          </p>
        </div>
      </div>
    </main>
  );
}
