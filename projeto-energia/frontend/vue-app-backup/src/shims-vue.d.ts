/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'chart.js/*' {
  const content: any
  export default content
}

declare module 'chartjs-plugin-zoom' {
  const content: any
  export default content
}

declare module 'vue-chartjs' {
  export const Line: any
  export const Bar: any
  export const Pie: any
} 