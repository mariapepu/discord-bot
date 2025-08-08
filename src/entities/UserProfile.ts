import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class UserProfile {
    @PrimaryColumn()
    userId!: string;

    @Column({default: 0})
    username!: string;

    @Column({default: 0})
    monedas!: number;

    @Column({default: 0})
    victorias!: number;

    @Column({default: 0})
    derrotas!: number;

    @Column({type: 'json', nullable: true, default: {}})
    cooldowns: Record<string, number>;

    @Column({type: 'json', nullable: true})
    inventory: { [itemName: string]: number };

}
