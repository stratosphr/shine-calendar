<template>
  <s-calendar :events="events">
    <template #event.header="{event, date}">
      {{`${event.color} ${date.format('YYYY-MM-DD')}`}}
    </template>
    <template #event.body="{event, date}">
      <div
          :class="event.color"
          class="px-1"
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
					start: moment('2020-03-16 00:30'),
					end: moment('2020-03-16 02:15'),
					color: 'green'
				},
				{
					start: moment('2020-03-17 02:30'),
					end: moment('2020-03-17 03:50'),
					color: 'blue'
				},
				{
					start: moment('2020-03-17 04:00'),
					end: moment('2020-03-17 05:00'),
					color: 'orange'
				},
				{
					start: moment('2020-03-18 03:30'),
					end: moment('2020-03-18 05:00'),
					color: 'red'
				},
				{
					start: moment('2020-03-19 00:30'),
					end: moment('2020-03-19 13:30'),
					color: 'indigo'
				}
			]
		})
	}
</script>

<style scoped>

</style>
