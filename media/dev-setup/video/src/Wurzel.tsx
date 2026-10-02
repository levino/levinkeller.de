import type React from 'react'
import { Composition } from 'remotion'
import { Film } from './Film'
import { bilderProSekunde, gesamtdauer } from './zeitplan'

export const Wurzel: React.FC = () => (
  <>
    {(['de', 'en'] as const).map((sprache) => (
      <Composition
        key={sprache}
        id={`Video-${sprache}`}
        component={Film}
        durationInFrames={gesamtdauer(sprache)}
        fps={bilderProSekunde}
        width={1920}
        height={1080}
        defaultProps={{ sprache }}
      />
    ))}
  </>
)
