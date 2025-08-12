import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class Item {
    @PrimaryColumn()
    id!: string;

    @Column({default: 0})
    name!: string;

    @Column({default: 0})
    price!: number;

    @Column({default: 0})
    description!: string;

    @Column({nullable: true})
    color!: number;

}

export const items = [
    {id: 'shield', name: '🛡️ Shield', price: 150, description: 'Blocks one robbery.', color: null},
    {id: 'mask', name: '🎭 Mask', price: 130, description: 'Reduces chance of being caught by police.', color: null},

    {id: 'pc-orange', name: '🧡 Orange', price: 30, description: 'Changes profile embed color.', color: 0xF59920},
    {id: 'pc-yellow', name: '💛 Yellow', price: 30, description: 'Changes profile embed color.', color: 0xF1F520},
    {id: 'pc-red', name: '❤️ Red', price: 30, description: 'Changes profile embed color.', color: 0xF52020},
    {id: 'pc-green', name: '💚 Green', price: 30, description: 'Changes profile embed color.', color: 0x2BED3E},
    {id: 'pc-blue', name: '💙 Blue', price: 30, description: 'Changes profile embed color.', color: 0x2BBCED},
    {id: 'pc-purple', name: '💜 Purple', price: 30, description: 'Changes profile embed color.', color: 0xA92BED},
    {id: 'pc-black', name: '🖤 Black', price: 30, description: 'Changes profile embed color.', color: 0x000000},
    {id: 'pc-white', name: '🤍 White', price: 30, description: 'Changes profile embed color.', color: 0xFFFFFF},
    {id: 'pc-perso', name: '💟 Personalized', price: 60, description: 'Changes profile embed color.', color: null}

];