<template>
  <s-calendar :events="events">
    <template #event="{event}">
      <div :class="event.color">
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
					start: moment('2020-03-17 01:30'),
					end: moment('2020-03-17 03:50'),
					color: 'blue'
				}
			]
		})
	}
</script>

<style scoped>

</style>
