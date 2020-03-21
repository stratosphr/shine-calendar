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
              class="text-wrap"
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
                class="overflow-hidden"
                v-for="event in optimizedEvents[day.date]"
            >
              <!-- HEADER -->
              <div
                  :style="{
              	    height: `${intervalHeight / 1.5}px`
                  }"
                  class="primary overflow-hidden"
              >
                <slot
                    name="event.header"
                    v-bind:date="moment(day.date)"
                    v-bind:event="event"
                />
              </div>
              <!-- BODY -->
              <div class="purple fill-height">
                <slot
                    name="event.body"
                    v-bind:date="moment(day.date)"
                    v-bind:event="event"
                />
              </div>
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
</style>
