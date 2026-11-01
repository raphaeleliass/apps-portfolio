import { MotionLink } from "@/components/motion-link";
import { MotionMain } from "@/components/motion-main";
export default function NotFound() {
  return (
    <MotionMain id="conteudo" className="notice">
      <h1>Projeto não encontrado.</h1>
      <p>Ele pode ter saído da seleção de fixados.</p>
      <MotionLink href="/">Voltar aos projetos</MotionLink>
    </MotionMain>
  );
}
