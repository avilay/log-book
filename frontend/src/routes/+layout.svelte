<script lang="ts">
  import { page, navigating } from '$app/state';

  let { children } = $props();
</script>

<div class="container">
  <nav>
    <ul>
      <li aria-current={page.url.pathname === '/new-log' ? 'page' : undefined}>
        <a href="/new-log">
          <svg 
            height="32" 
            id="svg8" 
            version="1.1" 
            viewBox="0 0 12.7 12.7" 
            width="32" 
            xmlns="http://www.w3.org/2000/svg">
            <defs id="defs2"/>
            <g id="layer1" transform="translate(0,-284.29999)">
              <path 
                d="m 4.9388885,287.82773 v 0.70554 h 2.2971892 l 0.188792,-0.70554 z m 4.9705834,0 -0.188792,0.70554 h 0.8626531 v -0.70554 z m -4.9705834,2.82221 v 0.70555 h 1.623329 l -0.034451,-0.1792 0.14056,-0.5264 z m 4.2140403,0 -0.188792,0.70555 h 1.6191962 v -0.70555 z m -4.2140403,2.82221 v 0.70558 h 5.6444445 v -0.70558 H 7.3945526 l -0.3472658,0.40102 -0.077171,-0.40102 z" 
                id="rect4543" 
                style="opacity:1;vector-effect:none;fill-opacity:0.37647059;stroke:none;stroke-width:0.7055555;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              />
              <circle 
                cx="3.1749997" 
                cy="293.11942" 
                id="path4549" 
                r="0.7055555" 
                style="opacity:1;vector-effect:none;fill:none;fill-opacity:0.37647059;stroke-width:0.7055555;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              />
              <circle 
                cx="3.1749997" 
                cy="290.29721" 
                id="circle4565" 
                r="0.7055555" 
                style="opacity:1;vector-effect:none;fill:none;fill-opacity:0.37647059;stroke-width:0.7055555;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              />
              <circle 
                cx="3.1749997" 
                cy="287.47495" 
                id="circle4567" 
                r="0.7055555" 
                style="opacity:1;vector-effect:none;fill:none;fill-opacity:0.37647059;stroke-width:0.7055555;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
              />
              <path 
                d="m 7.897988,286.06533 -1.3696772,5.1117 0.5193112,2.69563 1.7978374,-2.07475 1.3696776,-5.1117 z" 
                id="path5647" 
                style="fill:none;fill-rule:evenodd;stroke-width:0.7055555px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              />
              <path 
                d="m 7.0476217,293.87266 -0.3742176,-2.14579 1.7037858,0.45654 z" 
                id="path5649" 
                style="fill-opacity:0.37647059;fill-rule:evenodd;stroke-width:0.7055555;stroke-linecap:butt;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
              />
            </g>
          </svg>
          <br>
          New Log
        </a>
      </li>
      <li aria-current={page.url.pathname === '/history' ? 'page' : undefined}>
        <a href="/history">
          <svg 
          id="Layer_1" 
          height="32" 
          width="32" 
          style="enable-background:new 0 0 100.4 100.4;" 
          version="1.1" 
          viewBox="0 0 100.4 100.4" 
          xml:space="preserve" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlns:xlink="http://www.w3.org/1999/xlink">
          <g>
            <path d="M79.1,10.1H63.2V3.3c0-0.8-0.7-1.5-1.5-1.5H38c-0.8,0-1.5,0.7-1.5,1.5v6.8H19.7c-3.5,0-6.3,2.8-6.3,6.3v75.4   c0,3.5,2.8,6.3,6.3,6.3h59.5c3.5,0,6.3-2.8,6.3-6.3V16.4C85.4,12.9,82.6,10.1,79.1,10.1z M38,29.5h23.7c0.8,0,1.5-0.7,1.5-1.5v-6.5   h10.5v64.7H25.1V21.6h11.4V28C36.5,28.9,37.2,29.5,38,29.5z M60.2,4.8V20c0,0,0,0,0,0s0,0,0,0v6.5H39.5v-6.5c0,0,0,0,0,0s0,0,0,0   v-8.5c0,0,0,0,0,0s0,0,0,0V4.8L60.2,4.8L60.2,4.8z M82.4,91.7c0,1.8-1.5,3.3-3.3,3.3H19.7c-1.8,0-3.3-1.5-3.3-3.3V16.4   c0-1.8,1.5-3.3,3.3-3.3h16.8v5.5H23.6c-0.8,0-1.5,0.7-1.5,1.5v67.7c0,0.8,0.7,1.5,1.5,1.5h51.6c0.8,0,1.5-0.7,1.5-1.5V20.1   c0-0.8-0.7-1.5-1.5-1.5h-12v-5.5h15.9c1.8,0,3.3,1.5,3.3,3.3V91.7z"/>
            <path d="M28.8,46.4c0,0.8,0.7,1.5,1.5,1.5h38.5c0.8,0,1.5-0.7,1.5-1.5s-0.7-1.5-1.5-1.5H30.3C29.5,44.9,28.8,45.6,28.8,46.4z"/>
            <path d="M68.8,55.4H30.3c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5h38.5c0.8,0,1.5-0.7,1.5-1.5S69.6,55.4,68.8,55.4z"/>
            <path d="M68.8,66.4H30.3c-0.8,0-1.5,0.7-1.5,1.5c0,0.8,0.7,1.5,1.5,1.5h38.5c0.8,0,1.5-0.7,1.5-1.5C70.3,67.1,69.6,66.4,68.8,66.4z   "/>
          </g>
          </svg>
          <br>
          History
        </a>
      </li>
      <li aria-current={page.url.pathname === '/insights' ? 'page' : undefined}>
        <a href="/insights">
          <svg 
          id="Layer_1" 
          height="32"
          width="32"
          style="enable-background:new 0 0 256 256;" 
          version="1.1" 
          viewBox="0 0 256 256" 
          xml:space="preserve" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlns:xlink="http://www.w3.org/1999/xlink">
          <g>
            <path d="M75.4,159.2c-2.7,0-4.9,2.2-4.9,4.9v74.6H33.6v-74.4c0-2.7-2.2-4.9-4.9-4.9s-4.9,2.2-4.9,4.9v79.4c0,2.7,2.2,4.9,4.9,4.9   h46.7c2.7,0,4.9-2.2,4.9-4.9v-79.5C80.3,161.4,78.1,159.2,75.4,159.2z"/>
            <path d="M151.3,140.2c-2.7,0-4.9,2.2-4.9,4.9v93.6h-36.8v-78.9c0-2.7-2.2-4.9-4.9-4.9s-4.9,2.2-4.9,4.9v83.8c0,2.7,2.2,4.9,4.9,4.9   h46.7c2.7,0,4.9-2.2,4.9-4.9v-98.5C156.3,142.4,154.1,140.2,151.3,140.2z"/>
            <path d="M227.4,94.9c-2.7,0-4.9,2.2-4.9,4.9v138.9h-36.9V128.9c0-2.7-2.2-4.9-4.9-4.9c-2.7,0-4.9,2.2-4.9,4.9v114.7   c0,2.7,2.2,4.9,4.9,4.9h46.7c2.7,0,4.9-2.2,4.9-4.9V99.9C232.3,97.1,230.1,94.9,227.4,94.9z"/>
            <path d="M234.9,12c-0.1-1.8-1.2-3.3-2.7-4.1c-1.6-0.8-3.5-0.7-4.9,0.3L173.5,44c-1.5,1-2.3,2.7-2.2,4.4c0.1,1.8,1.2,3.3,2.7,4.1   L198,64.4C172.5,121,89.5,142.9,22.4,134.6c-2.7-0.4-5.2,1.6-5.5,4.3c-0.3,2.7,1.6,5.2,4.3,5.5c9.9,1.2,20,1.8,30.3,1.8   c64.4,0,131.5-24.6,155.4-77.5L232,81.2c0.7,0.3,1.4,0.5,2.2,0.5c1,0,1.9-0.3,2.7-0.8c1.5-1,2.3-2.7,2.2-4.4L234.9,12z M206.3,57.5   C206.2,57.5,206.2,57.4,206.3,57.5c-0.1-0.1-0.1-0.1-0.1-0.1l-20-9.9l39.5-26.3l3.1,47.4L206.3,57.5z"/>
          </g>
          </svg>
          <br>
          Insights
        </a>
      </li>
      <li aria-current={page.url.pathname === '/account' ? 'page' : undefined}>
        <a href="/account">
          <svg 
          enable-background="new 0 0 128 128" 
          height="32" 
          version="1.1" 
          viewBox="0 0 128 128" 
          width="32px" 
          xml:space="preserve" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="OBJECT">
            <path d="M88.689,69.672c2.992-4.606,4.738-10.093,4.738-15.983c0-16.226-13.201-29.427-29.426-29.427   c-16.227,0-29.428,13.201-29.428,29.427c0,5.893,1.748,11.383,4.743,15.99c-9.906,7.643-15.794,19.515-15.797,32.06   c0,0.531,0.21,1.04,0.585,1.415c0.375,0.375,0.884,0.586,1.415,0.586h76.963c1.104,0,2-0.896,2-2   C104.482,89.158,98.608,77.321,88.689,69.672z M64.001,28.261c14.02,0,25.426,11.407,25.426,25.427   c0,14.021-11.406,25.428-25.426,25.428c-14.021,0-25.428-11.407-25.428-25.428C38.573,39.668,49.98,28.261,64.001,28.261z    M27.574,99.739c0.586-10.543,5.764-20.384,14.141-26.865c5.401,6.265,13.385,10.242,22.286,10.242   c8.904,0,16.891-3.981,22.291-10.25c8.389,6.488,13.554,16.304,14.135,26.873H27.574z"/>
          </g>
          </svg>
          <br>
          Account
        </a>
      </li>
    </ul>
  </nav>

  <main>  
    {#if navigating.to}
      <p>Loading {navigating.to.url.pathname}...</p>
    {:else}
      {@render children()}
    {/if}
  </main>
</div>

<style lang="scss">
  @use "../styles/vars";

  .container {
    color: vars.$dark-color;
    height: 100%;

    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }

  nav {
    order: 1;

    background-color: vars.$light-color;
    font-size: 0.75rem;

    ul {
      padding: 0 1em;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;

      li {
        list-style-type: none;
        cursor: pointer;
        text-align: center;

        a {
          text-decoration: none;
          color: vars.$primary-color;
        }
      }
    }

    path, circle {
      fill: vars.$primary-color;
      stroke: vars.$primary-color;
    }

    li[aria-current="page"] path, li[aria-current="page"] circle {
      fill: vars.$darker-primary-color;
      stroke: vars.$darker-primary-color;
    }

    li[aria-current="page"] a {
      color: vars.$darker-primary-color;
    }
  }

  main {
    width: 80%;
    align-self: center;
    margin: 0;
    overflow-y: auto;
  }

  @media (min-width: 500px) {
    .container {
      justify-content: flex-start;
    }

    nav {
      order: -1;
    }
  }
</style>