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
                  zIndex: shouldDisplayGhosts ? 0 : 1,
                  borderLeft: 'solid white thin',
                  borderRight: 'solid white thin',
                  opacity: shouldDisplayGhosts ? ghostsOpacity : 1,
                  ...geometry(event)
                }"
                class="overflow-hidden"
                v-for="event in optimizedEvents[day.date]"
            >
              <div class="fill-height">
                <!-- RESIZER -->
                <div
                    :style="{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: `${resizerHeight}px`,
                      cursor: 'row-resize'
                    }"
                    @mousedown="notifyResizeStart(event, 'top')"
                    v-if="resizableEvents && !event.locked"
                />
                <!-- HEADER -->
                <div
                    :style="{
                      height: `${headerHeight}px`,
                      cursor: `${draggableEvents ? (dragging ? 'grabbing' : (event.locked ? 'not-allowed' : 'grab')) : 'default'}`
                    }"
                    @mousedown="notifyDragStart(event)"
                    class="overflow-hidden s-calendar-event-header"
                >
                  <slot
                      name="event.header"
                      v-bind:date="moment(day.date)"
                      v-bind:event="event"
                  />
                  <div
                      :style="{
                        position: 'absolute',
                        right: 0,
                        bottom: headerHeight < 18 ? (headerHeight < 13 ? (headerHeight < 10 ? '6px' : '4px') : '2px') : 0,
                        cursor: 'default'
                      }"
                      @mousedown.stop
                  >
                    <v-row no-gutters>
                      <v-col
                          :key="eventIndex"
                          v-for="(eventControl, eventIndex) in eventControls"
                      >
                        <v-icon
                            :color="eventControl.color ? eventControl.color(event) : 'gray'"
                            :disabled="eventControl.disabled && eventControl.disabled(event)"
                            :size="headerHeight - 2"
                            @click="eventControl.handler(event)"
                            v-text="eventControl.icon(event)"
                        />
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <!-- BODY -->
                <div
                    :style="{
                	    height: `${geometry(event).height.replace('px', '') - headerHeight}px`
                    }"
                    class="s-calendar-event-body"
                >
                  <slot
                      name="event.body"
                      v-bind:date="moment(day.date)"
                      v-bind:event="event"
                  />
                </div>
                <!-- RESIZER -->
                <div
                    :style="{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${resizerHeight}px`,
                      cursor: 'row-resize'
                    }"
                    @mousedown="notifyResizeStart(event, 'bottom')"
                    v-if="resizableEvents && !event.locked"
                />
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
            	    cursor: `${dragging ? 'grabbing' : resizing.status ? 'row-resize' : 'default'}`,
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
			intervalHeight: 20,
			dragging: false,
			resizing: {
				status: false,
				handler: null
			},
			events: [],
			selectedEvents: []
		}),

		props: {
			draggableEvents: {
				type: Boolean,
				default: true
			},
			resizableEvents: {
				type: Boolean,
				default: true
			},
			removableEvents: {
				type: Boolean,
				default: true
			},
			ghostsOpacity: {
				type: Number,
				default: 0.4
			},
			firstEvents: {
				type: Array,
				default: () => ([])
			}
		},

		created() {
			console.clear()
			this.events = [...this.firstEvents]
		},

		computed: {
			start() {
				return moment().startOf('week')
			},
			end() {
				return moment().endOf('week')
			},
			resizerHeight() {
				return this.headerHeight / 2.5
			},
			headerHeight() {
				return Math.min(22, this.intervalHeight / 1.5)
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
			},
			eventControls() {
				return [
					{
						icon: (event) => event.locked ? 'mdi-lock' : 'mdi-lock-open',
						color: (event) => event.locked ? 'error' : 'success',
						handler: (event) => {
							this.notifyLockClicked(event)
						}
					},
					{
						icon: () => 'mdi-close',
						disabled: (event) => event.locked,
						handler: (event) => {
							this.notifyRemoveClicked(event)
						}
					}
				]
			},
			shouldDisplayGhosts() {
				return this.dragging || this.resizing.status
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
				if (this.draggableEvents && !event.locked) {
					this.dragging = true
					this.addSelectedEvent(event)
				}
			},
			notifyDragCancel() {
				this.dragging = false
			},
			notifyResizeStart(event, handler) {
				this.resizing = {
					status: true,
					handler
				}
				this.addSelectedEvent(event)
			},
			notifyLockClicked(event) {
				this.$set(event, 'locked', !event.locked)
			},
			notifyRemoveClicked(event) {
				if (!event.locked) {
					this.events = this.cloneEvents(this.events.filter(e => !moment.range(e.start, e.end).isSame(event)))
				}
				this.selectedEvents = []
			},
			notifyDropEntered(date, interval) {
				if (this.shouldDisplayGhosts) {
					let start, end
					const time = moment.duration({minutes: interval * this.intervalMinutes + this.firstInterval * this.intervalMinutes})
					if (this.dragging) {
						start = moment(date).add(time)
						end = moment(start).add(moment.duration(this.selectedEvents[0].end.diff(this.selectedEvents[0].start)))
					} else if (this.resizing.status) {
						start = this.resizing.handler === 'top' ? moment(this.selectedEvents[0].start.format('YYYY-MM-DD')).add(time) : moment(this.selectedEvents[0].start)
						end = this.resizing.handler === 'bottom' ? moment(date).add(time).add({minutes: this.intervalMinutes}) : moment(this.selectedEvents[0].end)
					}
					if (end.isAfter(start)) {
						this.selectedEvents[0].start = start
						this.selectedEvents[0].end = end
					}
				}
			},
			notifyDrop() {
				if (this.dragging) {
					this.dragging = false
				} else if (this.resizing.status) {
					this.resizing.status = false
					this.resizing.handler = null
				}
				this.selectedEvents = []
			},
			addSelectedEvent(event) {
				this.selectedEvents = [...this.selectedEvents.filter(e => !moment.range(e.start, e.end).isSame(moment.range(event.start, event.end))), event]
			},
			moment(stringMoment) {
				return moment(stringMoment)
			},
			cloneEvents(events) {
				return events.map(event => ({
					...event,
					start: moment(event.start),
					end: moment(event.end)
				}))
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
