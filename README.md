# ha-catt-fix
This is a solution for the timeout issue when casting Home Assistant using CATT.

## Installation

1. It is recommended to install this with HACS by adding a custom repository (important: select "Lovelace" as category). Alternatively, download `ha-catt-fix.js` and put it inside `/config/www/`.

2. Add it as a resource to your Home Assistant UI. Follow the instructions displayed by HACS. If you are not installing with HACS, then:

   If you use the YAML mode, put the following in your `configuration.yaml`:

   ```
   lovelace:
     mode: yaml
     resources:
       - url: /local/ha-catt-fix.js
         type: module
   ```

   Otherwise go to *Settings -> Dashboards -> (three dots in the upper right corner) -> Resources*.

3. In case of the YAML mode, a restart of Home Assistant is required.

That's it. Continue to use CATT for casting HA to your display but dismantle anything you had set up to re-cast it every 10 minutes.

## How does it work

The reason for the timeout is that nothing is being played so the receiver application gets closed. The solution for that is to add a hidden Cast media player component and play an image every 9 minutes. That is not new, it has been used in the official Home Assistant Cast integration for quite a long time.

However, there's one problem with DashCast (which is used by CATT to cast websites). It replaces itself with the target website (`window.location = url`). It means it looses control of the display. That's why this solution is to embed the receiver code into the Home Assistant UI itself and do the dummy playback there.
