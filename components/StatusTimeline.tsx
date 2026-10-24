import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SmartCarIcon, VerifyIcon } from './icons/OrderCardIcons';
import FillingPumpIcon from './icons/FillingPumpIcon';
import { DeliveryStage } from '../types/order';

interface StepConfig {
  key: DeliveryStage;
  label: string;
  doneLabel?: string;
  color: string;
  Icon: React.ComponentType;
  dashedRing?: boolean;
}

const STEPS: StepConfig[] = [
  {
    key: 'arrived',
    label: "Heading to customer's location",
    doneLabel: 'Picked up cylinder from customer',
    color: '#52B922',
    Icon: SmartCarIcon,
  },
  { key: 'filling', label: 'Filling Process', color: '#0085FF', Icon: FillingPumpIcon },
  { key: 'completed', label: 'Refill Completion', color: '#0085FF', Icon: VerifyIcon, dashedRing: true },
];

interface StatusTimelineProps {
  stage: DeliveryStage;
  etaMinutes?: number;
  steps?: DeliveryStage[];
  /** 0-1 fill for the active 'arrived' step's progress bar, driven by real movement/distance. Defaults to a full bar. */
  activeProgress?: number;
}

const stageIndex = (stage: DeliveryStage) => STEPS.findIndex((s) => s.key === stage);

export default function StatusTimeline({ stage, etaMinutes = 5, steps, activeProgress }: StatusTimelineProps) {
  const currentIndex = stageIndex(stage);
  const visibleSteps = steps ? STEPS.filter((s) => steps.includes(s.key)) : STEPS;

  return (
    <View style={styles.wrap}>
      {visibleSteps.map((step, visibleIndex) => {
        const index = STEPS.findIndex((s) => s.key === step.key);
        const isLastVisible = visibleIndex === visibleSteps.length - 1;
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        const isPending = !isDone && !isActive;
        const isFillingStep = step.key === 'filling';
        const circleColor = isFillingStep ? '#fff' : isPending ? '#D1D5DB' : step.color;
        const ringColor = isPending ? '#D1D5DB' : step.color;

        const barFillPercent = isDone
          ? 100
          : isActive
            ? (step.key === 'arrived' && typeof activeProgress === 'number' ? activeProgress : 1) * 100
            : 0;

        return (
          <React.Fragment key={step.key}>
            <View style={styles.row}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: circleColor },
                  isFillingStep && { borderWidth: 2, borderColor: ringColor },
                  step.dashedRing && !isPending && styles.dashedRing,
                ]}
              >
                {isFillingStep ? <FillingPumpIcon animated={isActive} /> : <step.Icon />}
              </View>

              <View style={styles.content}>
                {step.key === 'filling' ? (
                  <View style={styles.inlineRow}>
                    <Text style={styles.label}>{step.label}</Text>
                    <View style={[styles.pill, isPending && styles.pillPending]}>
                      <Text
                        style={[
                          styles.pillText,
                          isActive && styles.pillTextActive,
                          isPending && styles.pillTextPending,
                        ]}
                      >
                        {isDone ? 'Completed' : isActive ? 'In progress' : 'Waiting'}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <Text style={styles.label}>
                      {isDone && step.doneLabel ? step.doneLabel : step.label}
                    </Text>
                    <Text style={styles.caption}>
                      {isDone ? 'Completed' : step.key === 'arrived' ? 'On the way' : `Arriving in ${etaMinutes} minutes`}
                    </Text>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { backgroundColor: isPending ? '#D1D5DB' : step.color, width: `${barFillPercent}%` },
                        ]}
                      />
                    </View>
                  </>
                )}
              </View>
            </View>

            {!isLastVisible && (
              <View style={styles.connectorWrap}>
                <View
                  style={[
                    styles.connector,
                    { borderColor: index < currentIndex ? STEPS[index].color : '#D1D5DB' },
                  ]}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 0,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedRing: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: '#000',
  },
  caption: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.6)',
  },
  pill: {
    backgroundColor: '#FAFAFA',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  pillPending: {
    backgroundColor: '#F4F4F4',
  },
  pillText: {
    fontSize: 10,
    color: '#52B922',
  },
  pillTextActive: {
    color: '#0085FF',
  },
  pillTextPending: {
    color: 'rgba(0,0,0,0.4)',
  },
  progressTrack: {
    height: 7,
    borderRadius: 24,
    backgroundColor: '#F4F4F4',
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: 7,
    borderRadius: 24,
  },
  connectorWrap: {
    height: 23,
    justifyContent: 'center',
    paddingLeft: 17,
  },
  connector: {
    width: 0,
    height: 23,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
  },
});
