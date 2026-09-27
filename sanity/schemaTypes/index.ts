import { album, award, event, eventCategory, project, sponsor, sponsorCategory, sponsorTier } from './content'
import { member } from './member'
import { contactSettings, homePage, recruitment, siteSettings, sponsorsPage } from './singletons'
import { team } from './team'

export const schemaTypes = [
  homePage,
  team,
  member,
  project,
  event,
  eventCategory,
  album,
  award,
  sponsor,
  sponsorCategory,
  sponsorTier,
  recruitment,
  sponsorsPage,
  contactSettings,
  siteSettings,
]
