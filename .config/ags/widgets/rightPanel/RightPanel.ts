
import waifu, { WaifuVisibility } from "./components/waifu";
import { globalMargin, globalOpacity, rightPanelExclusivity, rightPanelLock, rightPanelVisibility, rightPanelWidth, widgetLimit, Widgets } from "variables";
import Calendar from "widgets/Calendar";
import Update from "widgets/Update";
import NotificationHistory from "./NotificationHistory";
import { WidgetSelector } from "interfaces/widgetSelector.interface";
import { Resources } from "widgets/Resources";
import { exportSettings } from "utils/settings";
import MediaWidget from "widgets/MediaWidget";
import { custom_revealer } from "widgets/revealer";


const Notifications = await Service.import("notifications")
// Name need to match the name of the widget()
export const WidgetSelectors: WidgetSelector[] = [{
    name: "Waifu",
    icon: "",
    widget: () => waifu()
}, {
    name: "Media",
    icon: "",
    widget: () => MediaWidget()
}, {
    name: "NotificationHistory",
    icon: "",
    widget: () => NotificationHistory()
}, {
    name: "Calendar",
    icon: "",
    widget: () => Calendar()
}, {
    name: "Resources",
    icon: "",
    widget: () => Resources()
}, {
    name: "Update",
    icon: "󰚰",
    widget: () => Update()
}]


const maxRightPanelWidth = 600;
const minRightPanelWidth = 200;

const opacitySlider = () =>
{
    const label = Widget.Label({
        class_name: "icon",
        css: `min-width: 0px;`,
        label: "󱡓"
    })

    const slider = Widget.Slider({
        hexpand: false,
        vexpand: true,
        vertical: true,
        inverted: true,
        hpack: "center",
        height_request: 100,
        draw_value: false,
        class_name: "slider",
        value: globalOpacity.bind(),
        on_change: ({ value }) => globalOpacity.value = value,
    })

    return custom_revealer(label, slider, '', () => { }, true);
}

function WindowActions()
{
    return Widget.Box({
        vexpand: true,
        hpack: "end",
        vpack: "end",
        vertical: true,
        spacing: 5
    },
        opacitySlider(),

        Widget.Button({
            label: "󰈇",
            class_name: "export-settings",
            on_clicked: () => exportSettings()
        }), Widget.Button({
            label: "",
            class_name: "expand-window",
            on_clicked: () => rightPanelWidth.value = rightPanelWidth.value < maxRightPanelWidth ? rightPanelWidth.value + 50 : maxRightPanelWidth,
        }), Widget.Button({
            label: "",
            class_name: "shrink-window",
            on_clicked: () => rightPanelWidth.value = rightPanelWidth.value > minRightPanelWidth ? rightPanelWidth.value - 50 : minRightPanelWidth,
        }), WaifuVisibility(),
        Widget.ToggleButton({
            label: "",
            class_name: "exclusivity",
            onToggled: ({ active }) =>
            {
                rightPanelExclusivity.value = active;
            },
        }).hook(rightPanelExclusivity, (self) => self.active = rightPanelExclusivity.value, "changed"),
        Widget.ToggleButton({
            label: rightPanelLock.value ? "" : "",
            class_name: "lock",
            active: rightPanelLock.value,
            onToggled: (self) =>
            {
                rightPanelLock.value = self.active;
                self.label = self.active ? "" : "";
            },
        }),
        Widget.Button({
            label: "",
            class_name: "close",
            on_clicked: () => rightPanelVisibility.value = false,
        }),
    )
}

const WidgetActions = () => Widget.Box({
    vertical: true, spacing: 5,
    children: WidgetSelectors.map(selector =>
        Widget.ToggleButton({
            class_name: "selector",
            label: selector.icon,
            active: Widgets.value.find(w => w.name == selector.name) ? true : false,
            on_toggled: (self) =>
            {
                // If the button is active, create and store a new widget instance
                if (self.active) {
                    // Limit the number of widgets to 3
                    if (Widgets.value.length >= widgetLimit) {
                        self.active = false;
                        return
                    }
                    // Create widget only if it's not already created
                    if (!selector.widgetInstance) {
                        selector.widgetInstance = selector.widget();
                    }
                    // Add the widget instance to Widgets if it's not already added
                    if (!Widgets.value.includes(selector)) {
                        Widgets.value = [...Widgets.value, selector];
                    }
                }
                // If the button is deactivated, remove the widget from the array
                else {
                    let newWidgets = Widgets.value.filter(w => w != selector);  // Remove it from the array
                    if (Widgets.value.length == newWidgets.length) return;

                    Widgets.value = newWidgets;
                    selector.widgetInstance = undefined;  // Reset the widget instance
                }
            }
        })
    )
});

const Actions = () => Widget.Box({
    class_name: "right-panel-actions",
    vertical: true,
    children: [WidgetActions(), WindowActions()]

})

function Panel()
{
    return Widget.Box({
        css: `padding-left: 5px;`,
        child: Widget.EventBox({
            on_hover_lost: () =>
            {
                if (!rightPanelLock.value) rightPanelVisibility.value = false;
            },
            child: Widget.Box({
                children: [Widget.Box({
                    class_name: "main-content",
                    css: rightPanelWidth.bind().as(width => `*{min-width: ${width}px}`),
                    vertical: true,
                    spacing: 5,
                    children: Widgets.bind().as(widgets => widgets.map(widget => widget.widget())),
                }), Actions()
                ]
            }),
        })
    })
}

const Window = () => Widget.Window({
    name: `right-panel`,
    class_name: "right-panel",
    anchor: ["right", "top", "bottom"],
    exclusivity: "normal",
    layer: "overlay",
    keymode: "on-demand",
    visible: rightPanelVisibility.value,
    child: Panel(),
}).hook(rightPanelExclusivity, (self) =>
{
    self.exclusivity = rightPanelExclusivity.value ? "exclusive" : "normal"
    self.layer = rightPanelExclusivity.value ? "bottom" : "top"
    self.class_name = rightPanelExclusivity.value ? "right-panel exclusive" : "right-panel normal"
    self.margins = rightPanelExclusivity.value ? [0, 0] : [5, globalMargin, globalMargin, globalMargin]
}, "changed").hook(rightPanelVisibility, (self) => self.visible = rightPanelVisibility.value, "changed");

export default () =>
{
    return Window();
}