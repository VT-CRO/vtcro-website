import {
  AddUserIcon,
  CalendarIcon,
  CogIcon,
  DiamondIcon,
  EnvelopeIcon,
  HomeIcon,
  ImagesIcon,
  RocketIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
  WarningOutlineIcon,
} from './icons'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import type { ConfigContext } from 'sanity'
import type { DefaultDocumentNodeResolver, StructureBuilder } from 'sanity/structure'
import { AppearsOn } from './components/AppearsOn'

const singleton = (S: StructureBuilder, id: string, title: string, icon: any) =>
  S.listItem()
    .title(title)
    .id(id)
    .icon(icon)
    .child(S.document().schemaType(id).documentId(id).title(title))

/** The website manager's sidebar. Ordered by how often each area is edited. */
export const structure = (S: StructureBuilder, context: ConfigContext) =>
  S.list()
    .title('VT CRO Website')
    .items([
      singleton(S, 'homePage', 'Homepage', HomeIcon),
      S.divider(),

      S.listItem()
        .title('Teams')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Teams')
            .items([
              orderableDocumentListDeskItem({
                type: 'team',
                id: 'design-teams',
                title: 'Design Teams (drag to reorder)',
                filter: 'teamType == "design"',
                icon: UsersIcon,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: 'team',
                id: 'support-teams',
                title: 'Support Teams (drag to reorder)',
                filter: 'teamType == "support"',
                icon: UsersIcon,
                S,
                context,
              }),
            ]),
        ),

      S.listItem()
        .title('Members')
        .icon(UserIcon)
        .child(
          S.list()
            .title('Members')
            .items([
              S.listItem()
                .title('Active members')
                .icon(UserIcon)
                .child(S.documentTypeList('member').title('Active members').filter('_type == "member" && status == "active"')),
              S.listItem()
                .title('Alumni')
                .icon(UserIcon)
                .child(S.documentTypeList('member').title('Alumni').filter('_type == "member" && status == "alumni"')),
              S.listItem()
                .title('Inactive')
                .icon(UserIcon)
                .child(S.documentTypeList('member').title('Inactive').filter('_type == "member" && status == "inactive"')),
              S.divider(),
              S.documentTypeListItem('member').title('Everyone'),
            ]),
        ),

      S.listItem()
        .title('Events')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('Upcoming')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Upcoming events')
                    .filter('_type == "event" && coalesce(end, start) >= now()')
                    .defaultOrdering([{ field: 'start', direction: 'asc' }]),
                ),
              S.listItem()
                .title('Past')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Past events')
                    .filter('_type == "event" && coalesce(end, start) < now()')
                    .defaultOrdering([{ field: 'start', direction: 'desc' }]),
                ),
              S.divider(),
              S.documentTypeListItem('eventCategory').title('Event categories'),
            ]),
        ),

      S.documentTypeListItem('album').title('Gallery (albums)').icon(ImagesIcon),
      orderableDocumentListDeskItem({ type: 'award', title: 'Awards', icon: StarIcon, S, context }),
      orderableDocumentListDeskItem({ type: 'project', title: 'Projects', icon: RocketIcon, S, context }),

      S.listItem()
        .title('Sponsors')
        .icon(DiamondIcon)
        .child(
          S.list()
            .title('Sponsors')
            .items([
              orderableDocumentListDeskItem({ type: 'sponsor', title: 'Sponsors (drag to reorder)', icon: DiamondIcon, S, context }),
              orderableDocumentListDeskItem({ type: 'sponsorCategory', title: 'Sponsor categories', icon: DiamondIcon, S, context }),
              orderableDocumentListDeskItem({ type: 'sponsorTier', title: 'Sponsor tiers', icon: DiamondIcon, S, context }),
              S.divider(),
              singleton(S, 'sponsorsPage', 'Sponsors page text', DiamondIcon),
            ]),
        ),

      S.divider(),
      singleton(S, 'recruitment', 'Recruitment / Apply', AddUserIcon),
      singleton(S, 'contactSettings', 'Contact & social links', EnvelopeIcon),
      singleton(S, 'siteSettings', 'Site settings', CogIcon),

      S.divider(),
      S.listItem()
        .title('Placeholder content to replace')
        .icon(WarningOutlineIcon)
        .child(
          S.documentList()
            .title('Placeholder content')
            .filter('isPlaceholder == true')
            .apiVersion('2025-09-01'),
        ),
    ])

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (schemaType === 'member') {
    return S.document().views([S.view.form(), S.view.component(AppearsOn).title('Appears on')])
  }
  return S.document().views([S.view.form()])
}
