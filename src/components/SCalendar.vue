<template>
  <div>
    <v-sheet
        height="300"
        style="user-select: none"
    >
      <v-calendar
          :end="end.format('YYYY-MM-DD')"
          :event-ripple="false"
          :events="eventsContainers"
          :first-interval="firstInterval"
          :interval-count="intervalCount"
          :interval-height="intervalHeight"
          :interval-minutes="intervalMinutes"
          :short-intervals="false"
          :start="start.format('YYYY-MM-DD')"
          :weekdays="[1, 2, 3, 4, 5, 6]"
          locale="fr"
          ref="calendar"
          type="week"
      >
        <template #event="{day}">
          <div
              class="text-wrap s-calendar"
              style="position: relative"
              v-if="$refs.calendar"
          >
            <!-- EVENTS -->
            <div
                :style="{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  ...geometryForDate(event, moment(day.date))
                }"
                class="orange pa-1 overflow-auto s-calendar-event"
                v-for="event in optimizedEvents[day.date]"
            >
              <slot
                  name="event"
                  v-bind:date="moment(day.date)"
                  v-bind:event="event"
              />
            </div>
          </div>
        </template>
      </v-calendar>
    </v-sheet>
    <v-row class="mt-10">
      <v-col>
        <v-slider
            :max="60"
            :min="1"
            hide-details
            label="Minutes par interval"
            thumb-label="always"
            v-model="intervalMinutes"
        />
      </v-col>
      <v-col>
        <v-slider
            :max="60"
            :min="1"
            hide-details
            label="Hauteur des intervals"
            thumb-label="always"
            v-model="intervalHeight"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
	import Moment           from 'moment'
	import { extendMoment } from 'moment-range'

	const moment = extendMoment(Moment)
	moment.locale('fr')

	export default {
		name: 'SCalendar',

		data: () => ({
			firstInterval: 3,
			intervalMinutes: 30,
			intervalCount: 24,
			intervalHeight: 30
		}),

		props: {
			events: {
				type: Array,
				default: () => ([])
			}
		},

		created() {
			console.clear()
		},

		computed: {
			start() {
				return moment().startOf('week')
			},
			end() {
				return moment().endOf('week')
			},
			eventsContainers() {
				return [...moment.range(this.start, this.end).by('day')].map(day => ({
					start: day.format('YYYY-MM-DD 00:00'),
					end: day.format('YYYY-MM-DD 24:00')
				}))
			},
			optimizedEvents() {
				return this.events.reduce((object, event) => ({
					...object,
					[event.start.format('YYYY-MM-DD')]: [...(object[event.start.format('YYYY-MM-DD')] || []), event]
				}), {})
			}
		},

		methods: {
			geometryForDate(event) {
				const top = this.$refs.calendar.timeToY(event.start.format('HH:mm'))
				const height = this.$refs.calendar.timeToY(event.end.format('HH:mm')) - top
				return {
					top: `${top}px`,
					height: `${height}px`
				}
			},
			moment(stringMoment) {
				return moment(stringMoment)
			}
		}

	}
</script>

<style>
  /*noinspection CssUnusedSymbol*/
  .v-event-timed-container {
    margin: 0 !important;
  }

  /*noinspection CssUnusedSymbol*/
  .theme--light .v-calendar-events .v-event-timed, .theme--dark .v-calendar-events .v-event-timed {
    padding: 0 !important;
    border: 0 solid !important;
    cursor: default !important;
    border-radius: 0 !important;
  }

  /* Track */
  .s-calendar-event::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #F5F5F5;
    border-radius: 7px;
  }

  /* Scrollbar */
  .s-calendar-event::-webkit-scrollbar {
    width: 7px;
    background-color: transparent;
  }

  /* Handle */
  .s-calendar-event::-webkit-scrollbar-thumb {
    border-radius: 7px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0, rgb(123, 175, 239)), color-stop(1, rgb(78, 108, 198)));
  }

  /* Handle on hover */
  .s-calendar-event::-webkit-scrollbar-thumb:hover {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .5);
    background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0, rgb(123, 175, 239)), color-stop(1, rgb(78, 108, 198)));
  }
</style>
