<template>
  <div>
    <v-container>
      <s-calendar
          :custom-event-controls="[]"
          :draggable-events="true"
          :first-events="events"
          :first-interval="3"
          :forbidden-ranges-for-day="forbiddenRangesForDay"
          :ghosts-opacity="0.5"
          :height="300"
          :interval-count="45"
          :interval-minutes="30"
          :removable-events="true"
          :resizable-events="true"
          color="cyan"
      >
        <template #event.header="{event, date}">
          <div
              :class="[
                `${event.color}`,
                'px-1',
                'lighten-1',
                'font-weight-bold'
              ]"
              :style="{
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                fontSize: '0.8em'
              }"
          >
            {{`${event.color} ${date.format('YYYY-MM-DD')}`}}
          </div>
        </template>
        <template #event.body="{event}">
          <div
              :class="[event.color, 'px-1', 'lighten-3']"
              :style="{
                borderBottomLeftRadius: '4px',
                borderBottomRightRadius: '4px'
              }"
          >
            <div>
              Durée: {{`${moment.duration(event.end.diff(event.start)).hours()}h${moment.duration(event.end.diff(event.start)).minutes() || '00'}`}}
            </div>
            <div>
              {{event.start.format('YYYY-MM-DD HH:mm')}}
            </div>
            <div>
              {{event.end.format('YYYY-MM-DD HH:mm')}}
            </div>
          </div>
        </template>
      </s-calendar>
    </v-container>

    <EventsCreator />
  </div>
</template>

<script>
	import Moment           from 'moment'
	import { extendMoment } from 'moment-range'
	import SCalendar        from '@/components/SCalendar'
	import EventsCreator    from '@/components/EventsCreator'

	const moment = extendMoment(Moment)
	moment.locale('fr')

	export default {
		name: 'CustomCalendar',

		components: {
			EventsCreator,
			SCalendar
		},

		data: () => ({
			events: [
				{
					start: moment('2020-03-23 01:30'),
					end: moment('2020-03-23 04:30'),
					color: 'green'
				},
				{
					start: moment('2020-03-24 02:30'),
					end: moment('2020-03-24 03:30'),
					color: 'blue'
				},
				{
					start: moment('2020-03-24 08:30'),
					end: moment('2020-03-24 09:30'),
					color: 'teal'
				},
				{
					start: moment('2020-03-24 07:30'),
					end: moment('2020-03-24 08:30'),
					color: 'purple'
				},
				{
					start: moment('2020-03-24 09:30'),
					end: moment('2020-03-24 10:30'),
					color: 'blue-grey'
				},
				{
					start: moment('2020-03-24 03:30'),
					end: moment('2020-03-24 04:30'),
					color: 'orange'
				},
				{
					start: moment('2020-03-25 03:30'),
					end: moment('2020-03-25 05:00'),
					color: 'red'
				},
				{
					start: moment('2020-03-24 04:30'),
					end: moment('2020-03-24 07:30'),
					color: 'cyan'
				},
				{
					start: moment('2020-03-26 01:30'),
					end: moment('2020-03-26 13:30'),
					color: 'indigo',
					locked: true
				},
				{
					start: moment('2020-03-27 02:00'),
					end: moment('2020-03-27 09:00'),
					color: 'grey',
					locked: true
				},
				{
					start: moment('2020-03-30 02:00'),
					end: moment('2020-03-30 09:00'),
					color: 'cyan'
				},
				{
					start: moment('2020-04-03 03:00'),
					end: moment('2020-04-03 04:00'),
					color: 'purple'
				},
				{
					start: moment('2020-03-20 04:00'),
					end: moment('2020-03-20 09:00'),
					color: 'cyan'
				},
				{
					start: moment('2020-03-21 02:00'),
					end: moment('2020-03-21 04:00'),
					color: 'purple'
				}
			]
		}),

		computed: {
			moment() {
				return moment
			}
		},

		methods: {
			notifyColorClicked(event) {
				console.log(event.color)
			},
			forbiddenRangesForDay(day) {
				return [
					moment.range(moment(day).add({hours: 12}), moment(day).add({hours: 14})),
					moment.range(moment(day).add({
						hours: 2,
						minutes: 30
					}), moment(day).add({hours: 3}))
				]
			}
		}

	}
</script>

