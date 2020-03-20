<template>
  <v-sheet height="300">
    <v-calendar
        :end="end.format('YYYY-MM-DD')"
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

		created() {
			console.clear()
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
