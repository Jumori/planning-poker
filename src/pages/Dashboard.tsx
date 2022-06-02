import React from 'react'
import { PlusCircle } from 'phosphor-react'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { GameCards } from '../components/GameCards'

export const Dashboard = () => {
  return (
    <main className="py-4 px-10">
      <section>
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex justify-center items-center gap-2">
            <h1 className="text-3xl">Meus jogos</h1>
            <span className="bg-zinc-300 rounded-xl py-1 px-2 text-sm">
              2 jogos
            </span>
          </div>

          <p className="">
            Crie até 5 planning poker simultâneos e compartilhe a URL com seu
            time
          </p>
        </div>

        <div className="flex gap-6 py-10">
          <button className="bg-transparent border-2 border-violet-500 border-dashed rounded-lg flex flex-col justify-center items-center p-6 hover:opacity-75 transition-all duration-150 ease-linear">
            <PlusCircle size="50" weight="light" className="text-violet-500" />
            <p className="text-violet-500">Novo jogo</p>
          </button>

          <GameCards
            id="1"
            title="sprint 1"
            date={format(new Date(), 'dd MMM yyyy', { locale: ptBR })}
            url=""
            rounds={5}
            scoresHeight={[
              'h-[1rem]',
              'h-[2rem]',
              'h-[3rem]',
              'h-[4rem]',
              'h-[5rem]',
              'h-[6rem]',
              'h-[7rem]',
              'h-[8rem]',
              'h-[9rem]',
              'h-[9rem]'
            ]}
          />
          <GameCards
            id="2"
            title="sprint 2"
            date={format(subDays(new Date(), 15), 'dd MMM yyyy', {
              locale: ptBR
            })}
            url=""
            rounds={1}
            scoresHeight={[
              'h-[0rem]',
              'h-[0rem]',
              'h-[0rem]',
              'h-[0rem]',
              'h-[0rem]',
              'h-[0rem]',
              'h-[0rem]',
              'h-[0rem]',
              'h-[0rem]',
              'h-[0rem]'
            ]}
          />
          <GameCards
            id="3"
            title="sprint 3"
            date={format(subDays(new Date(), 30), 'dd MMM yyyy', {
              locale: ptBR
            })}
            url=""
            rounds={7}
            scoresHeight={[
              'h-[1rem]',
              'h-[2rem]',
              'h-[3rem]',
              'h-[4rem]',
              'h-[5rem]',
              'h-[6rem]',
              'h-[7rem]',
              'h-[8rem]',
              'h-[9rem]',
              'h-[90rem]'
            ]}
          />
        </div>
      </section>
    </main>
  )
}
