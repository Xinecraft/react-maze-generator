import React from 'react'

interface Props {
   i: any,
   j: any,
   visited: boolean, 
   walls: any
}

export class Cell extends React.Component<Props> {
    render() {
        const {
            props,
        } = this;

        let classes = 'cell w-3 h-3 md:h-4 md:w-4 lg:h-5 lg:w-5 flex justify-center items-center border-gray-400'
        if (props.walls.top) classes = classes + ' border-t'
        if (props.walls.left) classes = classes + ' border-l'
        if (props.walls.right) classes = classes + ' border-r'
        if (props.walls.bottom) classes = classes + ' border-b'
        if (props.visited) classes = classes + ' bg-black'
        return (
            <div className={classes}>
                
            </div>
        )
    }
}
