import { ScrollView } from 'react-native';
import { SizableText } from 'tamagui';

import Accordion from '~/src/components/Accordion';
import CustomHeader from '~/src/components/header/CustomHeader';
import { Container } from '~/tamagui.config';

const frequentlyAskedQuestions = [
  {
    question: 'Quels sont les temps d’expédition pour vos produits?',
    answer:
      'Nous prenons de 1 à 3 jours pour traiter votre commande puis de 2 à 7 jours pour vous la livrer.',
  },
  {
    question: 'Expédiez-vous partout dans le monde?',
    answer: 'Oui, absolument. Nous livrons dans le monde entier.',
  },
  {
    question: 'D’où expédions-nous votre produit?',
    answer: 'Notre boutique est située à Perpignan, en France.',
  },
];

const frequentlyAskedQuestions2 = [
  {
    question: 'Fournissez-vous des informations du suivi du produit?',
    answer: 'Oui. Suivez votre commande dans la page Suivre ma commande',
  },
  {
    question: 'Il manque certains articles de ma commande, que se passe-t-il?',
    answer:
      'Nos produits sont expédiés séparément selon votre commande. Si celle-ci contient par exemple des articles de deux entrepôts différents, il y aura par conséquent deux livraisons. Le reste de la commande arrivera très certainement sous peu.',
  },
  {
    question: 'J’ai reçu un article endommagé. Que puis-je faire?',
    answer:
      "Nous sommes navrés d’entendre cela. Envoyez-nous simplement une image de l’article endommagé en question à l'adresse email: info@mecaevent.com et nous vous enverrons un article similaire de remplacement aussi vite que possible.",
  },
  {
    question: 'Je n’ai toujours pas reçu ma commande. Qu’est-ce qui prend autant de temps?',
    answer:
      "Nous vous prions de nous excuser pour le retard. Parfois, l’expédition internationale peut prendre plus de temps que prévu en raison du dédouanement. Vous pouvez par contre tracer votre commande et voir où elle se trouve à tout moment. Si vous estimez toujours avoir besoin d’aide dans le traçage de votre colis ou que vous souhaitez vous renseigner sur cette dernière, veuillez communiquer avec nous par courriel à l'adresse suivante: info@mecaevent.com",
  },
  {
    question: 'Avez-vous une politique de remboursement?',
    answer:
      'Nous faisons de notre mieux pour résoudre tous les problèmes que nos clients pourraient rencontrer avec leurs articles en ligne. Si vous désirez tout de même recevoir un remboursement sur votre commande, nous pouvons bien entendu accomplir le paiement, dans le cas où le recours est fait dans les 14 jours suivant la date de la commande et que le ou les produits concernés ne sont pas soldés.',
  },
];

const FaqPage = () => {
  return (
    <>
      <CustomHeader title="FAQ" />
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SizableText fontWeight="700" mb={5} fontSize={18} textAlign="center">
            LIVRAISON
          </SizableText>
          {frequentlyAskedQuestions.map((faq, index) => (
            <Accordion key={index.toString()} title={faq.question} details={faq.answer} />
          ))}
          <SizableText fontWeight="700" mb={5} fontSize={18} textAlign="center" mt={20}>
            MA COMMANDE
          </SizableText>
          {frequentlyAskedQuestions2.map((faq, index) => (
            <Accordion key={index.toString()} title={faq.question} details={faq.answer} />
          ))}
        </ScrollView>
      </Container>
    </>
  );
};

export default FaqPage;
