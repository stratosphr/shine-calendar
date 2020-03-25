<template>
  <s-calendar
      :custom-event-controls="[

      ]"
      :draggable-events="true"
      :first-events="events"
      :ghosts-opacity="0.5"
      :removable-events="true"
      :resizable-events="true"
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
    <template #event.body="{event, date}">
      <div
          :class="[event.color, 'px-1', 'lighten-3']"
          :style="{
      	    borderBottomLeftRadius: '4px',
      	    borderBottomRightRadius: '4px'
          }"
      >
        <div>
          {{date.format('YYYY-MM-DD')}}
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
</template>

<script>
	import Moment           from 'moment'
	import { extendMoment } from 'moment-range'
	import SCalendar        from '@/components/SCalendar'

	const moment = extendMoment(Moment)
	moment.locale('fr')

	export default {
		name: 'CustomCalendar',

		components: {SCalendar},

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
				}
			]
		}),

		methods: {
			notifyColorClicked(event) {
				console.log(event.color)
			}
		}

	}
</script>

<style scoped>

</style>
