import type { CSSProperties} from "react";
import {Component} from "react";

export default class SvgIcon extends Component<{ name: string, prefix: string, color: string,width:string|number,height:string|number,className?:string,style?: CSSProperties | undefined}> {
    static defaultProps = {prefix: 'icon', color: '#5C5F62',height:20,width:20,className:""}

    render() {
        const {
            name,
            prefix,
            color,
            height,
            width,
            className,
            ...props
        } = this.props;
        const symbolId = `#${prefix}-${name}`

        return (
            <svg {...props} aria-hidden="true" width={width} height={height} className={className}>
                <use href={symbolId} fill={color} />
            </svg>
        )
    }
}
