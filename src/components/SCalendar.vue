<template>
  <v-sheet height="300">
    <v-calendar
        :end="end.format('YYYY-MM-DD')"
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
    </v-calendar>
  </v-sheet>
</template>

<script>
	import moment from 'moment'

	export default {
		name: 'SCalendar',

		data: () => ({
			intervalMinutes: 15,
			intervalCount: 3,
			firstInterval: 22,
			intervalHeight: 30
		}),

		created() {
			moment.locale('fr')
		},

		computed: {
			start() {
				return moment().startOf('week')
			},
			end() {
				return moment().endOf('week')
			}
		}

	}
</script>

<style scoped>

</style>
