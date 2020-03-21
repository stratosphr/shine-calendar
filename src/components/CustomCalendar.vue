<template>
  <s-calendar :events="events">
    <template #event="{event, date}">
      <div :class="event.color">
        <div>
          {{date.format('YYYY-MM-DD')}}
        </div>
        <div>
          {{event.start.format('YYYY-MM-DD HH:MM')}}
        </div>
        <div>
          {{event.end.format('YYYY-MM-DD HH:MM')}}
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
					end: moment('2020-03-16 02:00'),
					color: 'blue'
				},
				{
					start: moment('2020-03-17 02:30'),
					end: moment('2020-03-17 03:50'),
					color: 'blue'
				},
				{
					start: moment('2020-03-17 04:00'),
					end: moment('2020-03-17 05:00'),
					color: 'blue'
				},
				{
					start: moment('2020-03-18 03:30'),
					end: moment('2020-03-18 05:00'),
					color: 'red'
				}
			]
		})
	}
</script>

<style scoped>

</style>
