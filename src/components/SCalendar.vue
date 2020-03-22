<template>
  <div>
    <v-sheet
        @mouseleave="notifyDragCancel()"
        height="500"
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
          event-color="transparent"
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
                  zIndex: dragging ? 0 : 1,
                  borderLeft: 'solid white thin',
                  borderRight: 'solid white thin',
                  ...geometry(event)
                }"
                class="overflow-hidden"
                v-for="event in optimizedEvents[day.date]"
            >
              <div class="fill-height">
                <!-- HEADER -->
                <div
                    :style="{
                        height: `${intervalHeight / 1.5}px`,
                        cursor: `${draggableEvents ? (dragging ? 'grabbing' : 'grab') : 'default'}`
                      }"
                    @mousedown="notifyDragStart(event)"
                    class="overflow-hidden s-calendar-event-header"
                >
                  <slot
                      name="event.header"
                      v-bind:date="moment(day.date)"
                      v-bind:event="event"
                  />
                </div>
                <!-- BODY -->
                <div
                    :style="{
                	    height: `${geometry(event).height.replace('px', '') - intervalHeight / 1.5}px`,
                    }"
                    class="s-calendar-event-body"
                >
                  <slot
                      name="event.body"
                      v-bind:date="moment(day.date)"
                      v-bind:event="event"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- DROPS -->
          <div
              :style="{
            	    position: 'absolute',
            	    left: 0,
            	    right: 0,
            	    top: `${(interval - 1) * intervalHeight}px`,
            	    height: `${intervalHeight}px`,
            	    cursor: `${dragging ? 'grabbing' : 'default'}`,
                }"
              @mouseenter="notifyDropEntered(moment(day.date), interval - 1)"
              @mouseup="notifyDrop(moment(day.date), interval - 1)"
              v-for="interval in intervalCount"
          />
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
			intervalHeight: 30,
			dragging: false,
			selectedEvents: []
		}),

		props: {
			draggableEvents: {
				type: Boolean,
				default: true
			},
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
			geometry(event) {
				const top = this.$refs.calendar.timeToY(event.start.format('HH:mm')) + 2
				const height = this.$refs.calendar.timeToY(event.end.format('HH:mm')) - top - 1
				return {
					top: `${top}px`,
					height: `${height}px`
				}
			},
			notifyDragStart(event) {
				if (this.draggableEvents) {
					this.dragging = true
					this.addSelectedEvent(event)
				}
			},
			notifyDragCancel() {
				this.dragging = false
			},
			notifyDropEntered(date, interval) {
				if (this.dragging) {
					const time = moment.duration({minutes: interval * this.intervalMinutes + this.firstInterval * this.intervalMinutes})
					const duration = moment.duration(this.selectedEvents[0].end.diff(this.selectedEvents[0].start))
					this.selectedEvents[0].start = moment(date).add(time)
					this.selectedEvents[0].end = moment(this.selectedEvents[0].start).add(duration)
				}
			},
			notifyDrop(date, interval) {
				if (this.dragging) {
					this.dragging = false
					this.selectedEvents = []
				}
			},
			addSelectedEvent(event) {
				this.selectedEvents = [...this.selectedEvents.filter(e => !moment.range(e.start, e.end).isSame(moment.range(event.start, event.end))), event]
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

  .s-calendar-event-body > * {
    height: 100% !important;
  }

  .s-calendar-event-header > * {
    height: 100% !important;
  }
</style>
