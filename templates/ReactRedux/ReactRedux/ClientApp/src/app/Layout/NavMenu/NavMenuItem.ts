import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core";

export interface NavMenuItem {
    name: string;
    to: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    requireClaim?: string;
}