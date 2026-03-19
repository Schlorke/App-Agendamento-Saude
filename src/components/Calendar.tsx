/**
 * @component Calendar
 * @description Componente de calendário customizado e moderno para seleção de datas.
 * Exibe um calendário mensal com navegação entre meses, destaque de data selecionada,
 * e bloqueio de datas passadas e indisponíveis.
 *
 * @props
 *   - `selectedDate`: {Date | null} - Data atualmente selecionada.
 *   - `onDateSelect`: {(date: Date) => void} - Callback chamado quando uma data é selecionada.
 *   - `minDate`: {Date} - Data mínima permitida (padrão: hoje).
 *   - `maxDate`: {Date} - Data máxima permitida (padrão: 1 ano a partir de hoje).
 *   - `unavailableDates`: {Date[]} - Array de datas indisponíveis para seleção.
 *   - `style`: {ViewStyle} - Estilos customizados para o container do calendário.
 *
 * @state
 *   - `currentMonth`: {Date} - Mês atualmente exibido no calendário.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2025-12-06 - IA - Criação inicial do componente Calendar com navegação de meses e seleção de datas.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ViewStyle,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { fadeIn, slideUp } from '../utils/animations';

export interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  unavailableDates?: Date[];
  style?: ViewStyle;
}

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  unavailableDates = [],
  style,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Normaliza datas para comparação (remove horas)
  const normalizeDate = (date: Date): Date => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  // Verifica se uma data está disponível
  const isDateAvailable = (date: Date): boolean => {
    const normalized = normalizeDate(date);
    const normalizedMin = normalizeDate(minDate);
    const normalizedMax = normalizeDate(maxDate);

    // Verifica se está no range permitido
    if (normalized < normalizedMin || normalized > normalizedMax) {
      return false;
    }

    // Verifica se está na lista de indisponíveis
    return !unavailableDates.some(
      (unavailable) =>
        normalizeDate(unavailable).getTime() === normalized.getTime()
    );
  };

  // Verifica se é hoje
  const isToday = (date: Date): boolean => {
    return normalizeDate(date).getTime() === normalizeDate(today).getTime();
  };

  // Verifica se está selecionada
  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      normalizeDate(date).getTime() === normalizeDate(selectedDate).getTime()
    );
  };

  // Gera dias do mês
  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    // Adiciona dias vazios do início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(new Date(year, month, -i));
    }

    // Adiciona dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Navega para o mês anterior
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
    animateMonthChange();
  };

  // Navega para o próximo mês
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
    animateMonthChange();
  };

  // Anima mudança de mês
  const animateMonthChange = () => {
    slideAnim.setValue(20);
    fadeAnim.setValue(0.5);
    Animated.parallel([
      slideUp(slideAnim, 20, 200),
      fadeIn(fadeAnim, 200),
    ]).start();
  };

  // Verifica se pode navegar para o mês anterior
  const canGoPrevious = (): boolean => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return normalizeDate(prevMonth) >= normalizeDate(minDate);
  };

  // Verifica se pode navegar para o próximo mês
  const canGoNext = (): boolean => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return normalizeDate(nextMonth) <= normalizeDate(maxDate);
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = MONTHS[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  return (
    <View style={[styles.container, style]}>
      {/* Header do calendário */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goToPreviousMonth}
          disabled={!canGoPrevious()}
          style={[
            styles.navButton,
            !canGoPrevious() && styles.navButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Mês anterior"
          accessibilityHint="Navega para o mês anterior"
        >
          <ChevronLeft
            size={20}
            {...({
              style: {
                stroke: canGoPrevious()
                  ? theme.colors.primary
                  : theme.colors.disabled,
              },
            } as unknown as Record<string, unknown>)}
          />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.monthYearContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <Text style={styles.monthYear}>
            {monthName} {year}
          </Text>
        </Animated.View>

        <TouchableOpacity
          onPress={goToNextMonth}
          disabled={!canGoNext()}
          style={[styles.navButton, !canGoNext() && styles.navButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Próximo mês"
          accessibilityHint="Navega para o próximo mês"
        >
          <ChevronRight
            size={20}
            {...({
              style: {
                stroke: canGoNext()
                  ? theme.colors.primary
                  : theme.colors.disabled,
              },
            } as unknown as Record<string, unknown>)}
          />
        </TouchableOpacity>
      </View>

      {/* Dias da semana */}
      <View style={styles.daysOfWeekContainer}>
        {DAYS_OF_WEEK.map((day) => (
          <View key={day} style={styles.dayOfWeek}>
            <Text style={styles.dayOfWeekText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Grid de dias */}
      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const available = isDateAvailable(day);
          const isSelectedDay = isSelected(day);
          const isTodayDay = isToday(day);

          return (
            <TouchableOpacity
              key={`${day.getTime()}-${index}`}
              onPress={() => {
                if (available && isCurrentMonth) {
                  onDateSelect(day);
                }
              }}
              disabled={!available || !isCurrentMonth}
              style={[
                styles.dayCell,
                !isCurrentMonth && styles.dayCellOtherMonth,
                !available && styles.dayCellUnavailable,
                isSelectedDay && styles.dayCellSelected,
                isTodayDay && !isSelectedDay && styles.dayCellToday,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${day.getDate()} de ${MONTHS[day.getMonth()]}`}
              accessibilityState={{
                selected: isSelectedDay,
                disabled: !available || !isCurrentMonth,
              }}
            >
              <Text
                style={[
                  styles.dayText,
                  !isCurrentMonth && styles.dayTextOtherMonth,
                  !available && styles.dayTextUnavailable,
                  isSelectedDay && styles.dayTextSelected,
                  isTodayDay && !isSelectedDay && styles.dayTextToday,
                ]}
              >
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadow.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  navButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  monthYearContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthYear: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  dayOfWeek: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  dayOfWeekText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    margin: 2,
  },
  dayCellOtherMonth: {
    opacity: 0.3,
  },
  dayCellUnavailable: {
    opacity: 0.4,
  },
  dayCellSelected: {
    backgroundColor: theme.colors.primary,
  },
  dayCellToday: {
    backgroundColor: theme.colors.primaryLight + '20',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  dayText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  dayTextOtherMonth: {
    color: theme.colors.textSecondary,
  },
  dayTextUnavailable: {
    color: theme.colors.disabled,
    textDecorationLine: 'line-through',
  },
  dayTextSelected: {
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  dayTextToday: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default Calendar;
