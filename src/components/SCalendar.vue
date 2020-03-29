<template>
  <div>
    <v-toolbar
        dense
        flat
    >
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn
              @click="move(-1)"
              icon
          >
            <v-icon v-text="'mdi-chevron-left'" />
          </v-btn>
        </v-col>
        <v-col
            @click="move(1)"
            cols="auto"
        >
          <v-btn icon>
            <v-icon v-text="'mdi-chevron-right'" />
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-sheet
        :height="height"
        class="mt-2 elevation-3"
        style="user-select: none"
    >
      <v-calendar
          :color="color"
          :end="end.format('YYYY-MM-DD')"
          :event-ripple="false"
          :events="eventsContainers"
          :first-interval="firstInterval"
          :interval-count="intervalCount"
          :interval-height="intervalHeight"
          :interval-minutes="intervalMinutes"
          :short-intervals="false"
          :short-weekdays="false"
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
            <!-- EVENTS / GHOSTS -->
            <v-fade-transition
                :key="eventIndex"
                appear
                v-for="(event, eventIndex) in optimizedEvents[day.date]"
            >
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
              >
                <v-overlay
                    :value="(ghost && ghost.start.format('YYYY-MM-DD') === day.date) && !dropAllowed"
                    absolute
                    color="error"
                >
                  <v-expand-transition appear>
                    <v-row
                        align="center"
                        justify="center"
                    >
                      <v-col cols="12">
                        <v-icon
                            color="error"
                            v-text="'mdi-lock'"
                        />
                      </v-col>
                    </v-row>
                  </v-expand-transition>
                </v-overlay>
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
                      @touchstart="notifyResizeStart(event, 'top')"
                      v-if="resizableEvents && !event.locked"
                  />
                  <!-- HEADER -->
                  <div
                      :style="{
                      height: `${headerHeight}px`,
                      cursor: `${draggableEvents ? (dragging ? 'grabbing' : (event.locked ? 'not-allowed' : 'grab')) : 'default'}`
                    }"
                      @mousedown="notifyDragStart(event)"
                      @touchstart="notifyDragStart(event)"
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
                        @touchstart.stop
                        v-if="!shouldDisplayGhosts"
                    >
                      <v-row no-gutters>
                        <v-col
                            :key="eventIndex"
                            class="pl-1"
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
                      @touchstart="notifyResizeStart(event, 'bottom')"
                      v-if="resizableEvents && !event.locked"
                  />
                </div>
              </div>
            </v-fade-transition>
          </div>

          <!-- DROPS -->
          <div
              v-for="interval in intervalCount"
          >
            <div
                :class="intervalOverlapsForbiddenRange(day.date, interval - 1) ? 'error' : 'white'"
                :style="{
                  position: 'absolute',
                  left: 0,
                  width: 'calc(50%)',
                  top: `${(interval - 1) * intervalHeight}px`,
                  height: `${intervalHeight}px`,
                  cursor: `${dragging ? 'grabbing' : resizing.status ? 'row-resize' : 'default'}`,
                  opacity: 0.2
                }"
                @mouseenter="notifyDropEntered(moment(day.date), interval - 1, 'left')"
                @mouseup="notifyDrop(moment(day.date), interval - 1, 'left')"
            />
            <div
                :class="intervalOverlapsForbiddenRange(day.date, interval - 1) ? 'error' : 'white'"
                :style="{
                  position: 'absolute',
                  right: 0,
                  width: 'calc(50%)',
                  top: `${(interval - 1) * intervalHeight}px`,
                  height: `${intervalHeight}px`,
                  cursor: `${dragging ? 'grabbing' : resizing.status ? 'row-resize' : 'default'}`,
                  opacity: 0.2
                }"
                @mouseenter="notifyDropEntered(moment(day.date), interval - 1, 'right')"
                @mouseup="notifyDrop(moment(day.date), interval - 1, 'right')"
            />
          </div>
        </template>
      </v-calendar>
    </v-sheet>
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
			start: moment().startOf('week'),
			end: moment().endOf('week'),
			intervalHeight: 20,
			dragging: false,
			resizing: {
				status: false,
				handler: null
			},
			events: [],
			ghost: null,
			ghosts: [],
			tmpGhosts: [],
			dropAllowed: true
		}),

		props: {
			color: {
				type: String,
				default: undefined
			},
			firstInterval: {
				type: Number,
				default: 0
			},
			intervalMinutes: {
				type: Number,
				default: 60
			},
			intervalCount: {
				type: Number,
				default: 24
			},
			height: {
				type: Number,
				default: 500
			},
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
			customEventControls: {
				type: Array,
				default: []
			},
			forbiddenRangesForDay: {
				type: Function,
				default: () => []
			},
			firstEvents: {
				type: Array,
				default: []
			}
		},

		created() {
			this.events = [...this.firstEvents.map((event, index) => ({
				...event,
				index: index
			}))]
		},

		mounted() {
			// For phones
			this.$forceUpdate()
		},

		computed: {
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
				return (this.shouldDisplayGhosts ? [...this.ghosts, this.ghost] : this.events).reduce((object, event) => ({
					...object,
					[event.start.format('YYYY-MM-DD')]: [...(object[event.start.format('YYYY-MM-DD')] || []), event]
				}), {})
			},
			eventControls() {
				return [
					...this.customEventControls,
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
			},
			forbiddenRanges() {
				return [...moment.range(this.start, this.end).by('day')].map(day => [
					moment.range(moment(day.format('YYYY-MM-DD 00:00')), moment(day.format('YYYY-MM-DD 00:00')).add({minutes: this.firstInterval * this.intervalMinutes})),
					moment.range(moment(day.format('YYYY-MM-DD 00:00')).add({minutes: (this.intervalCount + this.firstInterval) * this.intervalMinutes}), moment(day.format('YYYY-MM-DD 24:00'))),
					...this.forbiddenRangesForDay(day)
				]).flat()
			}
		},

		methods: {
			move(amount) {
				this.start = moment(this.start).add({week: amount})
				this.end = moment(this.end).add({week: amount})
			},
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
					this.ghost = this.clone(event)
					this.ghosts = this.cloneAll(this.events.filter(ghost => ghost.index !== this.ghost.index))
					this.tmpGhosts = this.cloneAll(this.events.filter(ghost => ghost.index !== this.ghost.index))
				}
			},
			notifyResizeStart(event, handler) {
				this.resizing = {
					status: true,
					handler
				}
				this.ghost = this.clone(event)
				this.ghosts = this.cloneAll(this.events.filter(ghost => ghost.index !== this.ghost.index))
				this.tmpGhosts = this.cloneAll(this.events.filter(ghost => ghost.index !== this.ghost.index))
			},
			notifyLockClicked(event) {
				this.$set(event, 'locked', !event.locked)
			},
			notifyRemoveClicked(event) {
				if (!event.locked) {
					this.events = this.cloneAll(this.events.filter(e => !moment.range(e.start, e.end).isSame(event)))
				}
			},
			notifyDropEntered(date, interval, slot) {
				if (this.shouldDisplayGhosts) {
					let start, end
					const time = moment.duration({minutes: interval * this.intervalMinutes + this.firstInterval * this.intervalMinutes})
					if (this.dragging) {
						start = moment(date).add(time)
						end = moment(start).add(moment.duration(this.ghost.end.diff(this.ghost.start)))
					} else if (this.resizing.status) {
						start = this.resizing.handler === 'top' ? moment(this.ghost.start.format('YYYY-MM-DD')).add(time) : moment(this.ghost.start)
						end = this.resizing.handler === 'bottom' ? moment(this.ghost.start.format('YYYY-MM-DD')).add(time).add({minutes: this.intervalMinutes}) : moment(this.ghost.end)
					}
					if (end.isAfter(start)) {
						this.ghosts = this.cloneAll(this.tmpGhosts)
						this.ghost = {
							...this.ghost,
							start,
							end
						}
						if (this.overlapsForbiddenRange(this.ghost)) {
							this.dropAllowed = false
						} else {
							this.dropAllowed = true
							this.schedule(slot)
						}
					}
				}
			},
			schedule(slot) {
				const before = []
				const after = []
				// Gathering tmpGhosts before, same or after and overlapping before, same or after the ghost
				this.tmpGhosts.filter(tmpGhost => tmpGhost.start.isSame(this.ghost.start, 'day')).forEach(tmpGhost => {
					if (tmpGhost.start.isBefore(this.ghost.start)) {
						before.push(tmpGhost)
					} else if (tmpGhost.start.isSame(this.ghost.start)) {
						if (slot === 'left') {
							before.push(tmpGhost)
						} else {
							after.push(tmpGhost)
						}
					} else {
						after.push(tmpGhost)
					}
				})
				// Sorting gathered tmpGhosts
				before.sort((first, second) => {
					return first.start.isBefore(second.start) ? 1 : first.start.isSame(second.start) ? 0 : -1
				})
				after.sort((first, second) => {
					return first.start.isAfter(second.start) ? 1 : first.start.isSame(second.start) ? 0 : -1
				})
				// Scheduling
				if (before.length) {
					const previous = before.shift()
					this._scheduleBefore(this.ghost, previous, before)
				}
				if (after.length) {
					const next = after.shift()
					this._scheduleAfter(this.ghost, next, after)
				}
			},
			_scheduleBefore(after, before, remaining) {
				if (after.start.isBefore(before.end)) {
					const diff = moment.duration(before.end.diff(after.start))
					const ghost = this.ghosts.find(ghost => ghost.index === before.index)
					if (ghost.locked || this.overlapsForbiddenRange({
						start: moment(ghost.start).subtract(diff),
						end: moment(ghost.end).subtract(diff)
					})) {
						this.dropAllowed = false
					} else {
						ghost.start.subtract(diff)
						ghost.end.subtract(diff)
					}
					if (remaining.length) {
						this._scheduleBefore(ghost, remaining.shift(), remaining)
					}
				}
			},
			_scheduleAfter(before, after, remaining) {
				if (before.end.isAfter(after.start)) {
					const diff = moment.duration(before.end.diff(after.start))
					const ghost = this.ghosts.find(ghost => ghost.index === after.index)
					if (ghost.locked || this.overlapsForbiddenRange({
						start: moment(ghost.start).add(diff),
						end: moment(ghost.end).add(diff)
					})) {
						this.dropAllowed = false
					} else {
						ghost.start.add(diff)
						ghost.end.add(diff)
					}
					if (remaining.length) {
						this._scheduleAfter(ghost, remaining.shift(), remaining)
					}
				}
			},
			notifyDrop() {
				if (this.shouldDisplayGhosts) {
					this.dragging = false
					this.resizing.status = false
					this.resizing.handler = null
					if (this.dropAllowed) {
						this.events = this.cloneAll([...this.ghosts, this.ghost])
					}
					this.dropAllowed = true
				}
			},
			overlapsForbiddenRange(event) {
				const eventRange = moment.range(event.start, event.end)
				return this.forbiddenRanges.some(forbiddenPeriod => eventRange.overlaps(forbiddenPeriod))
			},
			intervalOverlapsForbiddenRange(date, interval) {
				return this.overlapsForbiddenRange({
					start: moment(date).add(moment.duration({minutes: interval * this.intervalMinutes + this.firstInterval * this.intervalMinutes})),
					end: moment(date).add(moment.duration({minutes: (interval + 1) * this.intervalMinutes + this.firstInterval * this.intervalMinutes}))
				}) ? 'red' : ''
			},
			moment(stringMoment) {
				return moment(stringMoment)
			},
			clone(event) {
				return {
					...event,
					start: moment(event.start),
					end: moment(event.end)
				}
			},
			cloneAll(events) {
				return events.map(event => this.clone(event))
			},
			print(event) {
				console.log(event.start.format('YYYY-MM-DD HH:mm'), event.end.format('YYYY-MM-DD HH:mm'), moment.range(event.start, event.end).duration('minutes'))
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
