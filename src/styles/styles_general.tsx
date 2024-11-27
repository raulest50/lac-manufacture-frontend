

const my_style_tab={
    borderRadius:0,
//    border:0,
    ':active':{
        bg:'blue.200',
    },
    ':selected':{
        bg:'blue.200',
    },
}

const input_style = {
    bg:'gray.200',
    variant:'filled',
    borderRadius:0,
}

const cardItem_style_sel_tray = {
    borderRadius:'0',
    ':hover':{
        bg:'teal.200',
    },
    borderLeft: "0.7em solid",
    borderColor: "blue.200",
}

const cardItem_style_rcta = {
    borderRadius:'0',
    ':hover':{
        bg:'teal.200',
    },
    borderLeft: "0.7em solid",
    borderColor: "green.200",
}


export {my_style_tab, input_style, cardItem_style_rcta, cardItem_style_sel_tray}