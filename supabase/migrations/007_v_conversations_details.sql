CREATE OR REPLACE VIEW v_conversations_details WITH (security_invoker=true) AS
SELECT 
  c.id as conversation_id,
  c.projet_id,
  c.artisan_id,
  c.particulier_id,
  c.created_at as conversation_created_at,
  p.titre as projet_titre,
  -- Particular details
  part.profil_id as particulier_profil_id,
  prof_part.prenom as particulier_prenom,
  prof_part.nom as particulier_nom,
  -- Artisan details
  art.profil_id as artisan_profil_id,
  art.nom_entreprise as artisan_nom_entreprise,
  prof_art.prenom as artisan_prenom,
  prof_art.nom as artisan_nom,
  -- Last message details
  lm.contenu as last_message,
  lm.created_at as last_message_date,
  -- Unread counts
  (SELECT count(*) FROM messages m WHERE m.conversation_id = c.id AND m.lu = false AND m.auteur_id != part.profil_id) as unread_particulier_count,
  (SELECT count(*) FROM messages m WHERE m.conversation_id = c.id AND m.lu = false AND m.auteur_id != art.profil_id) as unread_artisan_count
FROM conversations c
JOIN projets p ON p.id = c.projet_id
JOIN particuliers part ON part.id = c.particulier_id
JOIN profiles prof_part ON prof_part.id = part.profil_id
JOIN artisans art ON art.id = c.artisan_id
JOIN profiles prof_art ON prof_art.id = art.profil_id
LEFT JOIN LATERAL (
  SELECT contenu, created_at 
  FROM messages m 
  WHERE m.conversation_id = c.id 
  ORDER BY created_at DESC 
  LIMIT 1
) lm ON true;
